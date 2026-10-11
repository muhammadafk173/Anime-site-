package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.AnimeViewModel
import com.example.ui.NavTab
import com.example.ui.components.AnimeVerseNavBar
import com.example.ui.screens.AnimeDetailsScreen
import com.example.ui.screens.FavoritesScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.ProfileScreen
import com.example.ui.screens.SearchScreen
import com.example.ui.screens.VideoPlayerScreen
import com.example.ui.theme.AnimeVerseTheme

class MainActivity : ComponentActivity() {

    private val viewModel: AnimeViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val amoledMode by viewModel.amoledMode.collectAsStateWithLifecycle()

            AnimeVerseTheme(amoledMode = amoledMode) {
                AnimeVerseApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun AnimeVerseApp(viewModel: AnimeViewModel) {
    val currentTab by viewModel.currentTab.collectAsStateWithLifecycle()
    val selectedAnime by viewModel.selectedAnime.collectAsStateWithLifecycle()
    val activePlayback by viewModel.activePlayback.collectAsStateWithLifecycle()
    val favorites by viewModel.favorites.collectAsStateWithLifecycle()
    val watchProgressList by viewModel.watchProgressList.collectAsStateWithLifecycle()
    val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
    val selectedGenre by viewModel.selectedGenre.collectAsStateWithLifecycle()
    val selectedSort by viewModel.selectedSort.collectAsStateWithLifecycle()
    val searchResults by viewModel.searchResults.collectAsStateWithLifecycle()
    val isAmoledMode by viewModel.amoledMode.collectAsStateWithLifecycle()
    val snackbarMessage by viewModel.snackbarMessage.collectAsStateWithLifecycle()

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(snackbarMessage) {
        snackbarMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearSnackbar()
        }
    }

    // Video Player takes over the full screen when active
    if (activePlayback != null) {
        val currentPlay = activePlayback!!
        val currentIndex = currentPlay.anime.episodes.indexOfFirst { it.id == currentPlay.episode.id }
        val hasNext = currentIndex != -1 && currentIndex + 1 < currentPlay.anime.episodes.size

        VideoPlayerScreen(
            anime = currentPlay.anime,
            episode = currentPlay.episode,
            initialPositionMs = currentPlay.initialPositionMs,
            hasNextEpisode = hasNext,
            onNextEpisode = { viewModel.playNextEpisode() },
            onClosePlayer = { viewModel.closePlayer() },
            onSaveProgress = { pos, duration ->
                viewModel.saveProgress(pos, duration)
            }
        )
        return
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.background,
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = {
            // Show bottom nav on main tabs, hide when inside anime details
            if (selectedAnime == null) {
                AnimeVerseNavBar(
                    currentTab = currentTab,
                    onTabSelected = { tab -> viewModel.setTab(tab) },
                    favoritesCount = favorites.size
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            if (selectedAnime != null) {
                // Details Screen
                val currentAnime = selectedAnime!!
                val isFav = favorites.any { it.animeId == currentAnime.id }
                val animeProgress = watchProgressList.find { it.animeId == currentAnime.id }

                AnimeDetailsScreen(
                    anime = currentAnime,
                    isFavorite = isFav,
                    watchProgress = animeProgress,
                    onBackClick = { viewModel.selectAnime(null) },
                    onToggleFavorite = { viewModel.toggleFavorite(currentAnime) },
                    onPlayEpisode = { ep ->
                        val savedPos = if (animeProgress?.episodeId == ep.id) animeProgress.positionMs else 0L
                        viewModel.playEpisode(currentAnime, ep, savedPos)
                    },
                    onResumeAnime = { viewModel.resumeAnime(currentAnime) }
                )
            } else {
                // Main Tab Routing
                when (currentTab) {
                    NavTab.HOME -> {
                        HomeScreen(
                            allAnime = viewModel.allAnime,
                            trendingAnime = viewModel.trendingAnime,
                            popularAnime = viewModel.popularAnime,
                            recentlyAddedAnime = viewModel.recentlyAddedAnime,
                            genres = viewModel.genres,
                            watchProgressList = watchProgressList,
                            isAnimeFavorite = { id -> viewModel.isAnimeFavorite(id) },
                            onAnimeClick = { anime -> viewModel.selectAnime(anime) },
                            onWatchClick = { anime -> viewModel.resumeAnime(anime) },
                            onToggleFavorite = { anime -> viewModel.toggleFavorite(anime) },
                            onGenreSelect = { genre -> viewModel.setSelectedGenre(genre) },
                            onNavigateTab = { tab -> viewModel.setTab(tab) }
                        )
                    }

                    NavTab.SEARCH -> {
                        SearchScreen(
                            searchQuery = searchQuery,
                            selectedGenre = selectedGenre,
                            selectedSort = selectedSort,
                            genres = viewModel.genres,
                            searchResults = searchResults,
                            onQueryChange = { q -> viewModel.setSearchQuery(q) },
                            onGenreSelect = { g -> viewModel.setSelectedGenre(g) },
                            onSortSelect = { s -> viewModel.setSelectedSort(s) },
                            onAnimeClick = { anime -> viewModel.selectAnime(anime) }
                        )
                    }

                    NavTab.FAVORITES -> {
                        FavoritesScreen(
                            favorites = favorites,
                            allAnime = viewModel.allAnime,
                            onAnimeClick = { anime -> viewModel.selectAnime(anime) },
                            onRemoveFavorite = { id -> viewModel.removeFavorite(id) },
                            onExploreClick = { viewModel.setTab(NavTab.HOME) }
                        )
                    }

                    NavTab.PROFILE -> {
                        ProfileScreen(
                            favoritesCount = favorites.size,
                            watchHistory = watchProgressList,
                            isAmoledMode = isAmoledMode,
                            onToggleAmoled = { viewModel.toggleAmoledMode() },
                            onClearHistory = { viewModel.clearWatchHistory() }
                        )
                    }
                }
            }
        }
    }
}
