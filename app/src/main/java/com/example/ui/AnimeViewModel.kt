package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AnimeDatabase
import com.example.data.local.FavoriteEntity
import com.example.data.local.WatchProgressEntity
import com.example.data.model.Anime
import com.example.data.model.Episode
import com.example.data.repository.AnimeCatalog
import com.example.data.repository.AnimeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class NavTab {
    HOME,
    SEARCH,
    FAVORITES,
    PROFILE
}

enum class SortOption(val displayName: String) {
    POPULAR("Most Popular"),
    RATING("Highest Rated"),
    YEAR("Release Year")
}

data class ActivePlayback(
    val anime: Anime,
    val episode: Episode,
    val initialPositionMs: Long = 0L
)

class AnimeViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: AnimeRepository

    init {
        val database = AnimeDatabase.getDatabase(application)
        repository = AnimeRepository(database.animeDao())
    }

    val allAnime: List<Anime> = repository.allAnime
    val genres: List<String> = AnimeCatalog.getGenres()

    // Navigation state
    private val _currentTab = MutableStateFlow(NavTab.HOME)
    val currentTab: StateFlow<NavTab> = _currentTab.asStateFlow()

    private val _selectedAnime = MutableStateFlow<Anime?>(null)
    val selectedAnime: StateFlow<Anime?> = _selectedAnime.asStateFlow()

    private val _activePlayback = MutableStateFlow<ActivePlayback?>(null)
    val activePlayback: StateFlow<ActivePlayback?> = _activePlayback.asStateFlow()

    private val _isFullscreen = MutableStateFlow(false)
    val isFullscreen: StateFlow<Boolean> = _isFullscreen.asStateFlow()

    // Search state
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedGenre = MutableStateFlow("All")
    val selectedGenre: StateFlow<String> = _selectedGenre.asStateFlow()

    private val _selectedSort = MutableStateFlow(SortOption.POPULAR)
    val selectedSort: StateFlow<SortOption> = _selectedSort.asStateFlow()

    // Preferences & UI State
    private val _amoledMode = MutableStateFlow(false)
    val amoledMode: StateFlow<Boolean> = _amoledMode.asStateFlow()

    private val _snackbarMessage = MutableStateFlow<String?>(null)
    val snackbarMessage: StateFlow<String?> = _snackbarMessage.asStateFlow()

    // Room DB Flows
    val favorites: StateFlow<List<FavoriteEntity>> = repository.favorites
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val watchProgressList: StateFlow<List<WatchProgressEntity>> = repository.watchProgressList
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    // Curated Home Sections
    val trendingAnime: List<Anime> = allAnime.filter { it.isTrending }
    val popularAnime: List<Anime> = allAnime.sortedByDescending { it.rating }
    val recentlyAddedAnime: List<Anime> = allAnime.filter { it.isRecentlyAdded }

    // Reactive Search Results
    val searchResults: StateFlow<List<Anime>> = combine(
        _searchQuery,
        _selectedGenre,
        _selectedSort
    ) { query, genre, sort ->
        var list = allAnime

        if (query.isNotBlank()) {
            val q = query.trim().lowercase()
            list = list.filter {
                it.title.lowercase().contains(q) ||
                    it.japaneseTitle.lowercase().contains(q) ||
                    it.genres.any { g -> g.lowercase().contains(q) } ||
                    it.description.lowercase().contains(q)
            }
        }

        if (genre != "All") {
            list = list.filter { it.genres.any { g -> g.equals(genre, ignoreCase = true) } }
        }

        when (sort) {
            SortOption.POPULAR -> list.sortedByDescending { it.isTrending || it.isPopular }
            SortOption.RATING -> list.sortedByDescending { it.rating }
            SortOption.YEAR -> list.sortedByDescending { it.releaseYear }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = allAnime
    )

    // Navigation actions
    fun setTab(tab: NavTab) {
        _currentTab.value = tab
    }

    fun selectAnime(anime: Anime?) {
        _selectedAnime.value = anime
    }

    fun playEpisode(anime: Anime, episode: Episode, startPositionMs: Long = 0L) {
        _activePlayback.value = ActivePlayback(
            anime = anime,
            episode = episode,
            initialPositionMs = startPositionMs
        )
    }

    fun resumeAnime(anime: Anime) {
        val lastProgress = watchProgressList.value.find { it.animeId == anime.id }
        if (lastProgress != null) {
            val ep = anime.episodes.find { it.id == lastProgress.episodeId }
                ?: anime.episodes.firstOrNull()
            if (ep != null) {
                playEpisode(anime, ep, lastProgress.positionMs)
                return
            }
        }
        val firstEp = anime.episodes.firstOrNull()
        if (firstEp != null) {
            playEpisode(anime, firstEp, 0L)
        }
    }

    fun closePlayer() {
        _activePlayback.value = null
        _isFullscreen.value = false
    }

    fun setFullscreen(fullscreen: Boolean) {
        _isFullscreen.value = fullscreen
    }

    fun playNextEpisode() {
        val current = _activePlayback.value ?: return
        val currentIndex = current.anime.episodes.indexOfFirst { it.id == current.episode.id }
        if (currentIndex != -1 && currentIndex + 1 < current.anime.episodes.size) {
            val nextEp = current.anime.episodes[currentIndex + 1]
            playEpisode(current.anime, nextEp, 0L)
            showSnackbar("Playing Episode ${nextEp.number}: ${nextEp.title}")
        }
    }

    fun playPrevEpisode() {
        val current = _activePlayback.value ?: return
        val currentIndex = current.anime.episodes.indexOfFirst { it.id == current.episode.id }
        if (currentIndex > 0) {
            val prevEp = current.anime.episodes[currentIndex - 1]
            playEpisode(current.anime, prevEp, 0L)
            showSnackbar("Playing Episode ${prevEp.number}: ${prevEp.title}")
        }
    }

    // Favorites actions
    fun toggleFavorite(anime: Anime) {
        viewModelScope.launch {
            val isFav = favorites.value.any { it.animeId == anime.id }
            repository.toggleFavorite(anime)
            showSnackbar(if (isFav) "Removed '${anime.title}' from Favorites" else "Added '${anime.title}' to Favorites")
        }
    }

    fun removeFavorite(animeId: String) {
        viewModelScope.launch {
            repository.removeFavorite(animeId)
            showSnackbar("Removed from Favorites")
        }
    }

    fun isAnimeFavorite(animeId: String): Boolean {
        return favorites.value.any { it.animeId == animeId }
    }

    // Watch Progress
    fun saveProgress(positionMs: Long, durationMs: Long) {
        val current = _activePlayback.value ?: return
        if (positionMs <= 0 || durationMs <= 0) return
        viewModelScope.launch {
            repository.saveWatchProgress(
                animeId = current.anime.id,
                episodeId = current.episode.id,
                episodeNumber = current.episode.number,
                episodeTitle = current.episode.title,
                positionMs = positionMs,
                durationMs = durationMs
            )
        }
    }

    fun clearWatchHistory() {
        viewModelScope.launch {
            repository.clearWatchHistory()
            showSnackbar("Watch history cleared")
        }
    }

    // Search & Filter
    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setSelectedGenre(genre: String) {
        _selectedGenre.value = genre
    }

    fun setSelectedSort(sort: SortOption) {
        _selectedSort.value = sort
    }

    // Settings
    fun toggleAmoledMode() {
        _amoledMode.value = !_amoledMode.value
    }

    fun showSnackbar(message: String) {
        _snackbarMessage.value = message
    }

    fun clearSnackbar() {
        _snackbarMessage.value = null
    }
}
