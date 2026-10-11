package com.example.data.repository

import com.example.data.local.AnimeDao
import com.example.data.local.FavoriteEntity
import com.example.data.local.WatchProgressEntity
import com.example.data.model.Anime
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull

class AnimeRepository(private val animeDao: AnimeDao) {

    val allAnime: List<Anime> = AnimeCatalog.catalog

    val favorites: Flow<List<FavoriteEntity>> = animeDao.getAllFavorites()

    val watchProgressList: Flow<List<WatchProgressEntity>> = animeDao.getAllWatchProgress()

    fun isFavorite(animeId: String): Flow<Boolean> = animeDao.isFavorite(animeId)

    fun getWatchProgressForAnime(animeId: String): Flow<WatchProgressEntity?> =
        animeDao.getWatchProgressForAnime(animeId)

    suspend fun toggleFavorite(anime: Anime) {
        val isFav = animeDao.isFavorite(anime.id).firstOrNull() ?: false
        if (isFav) {
            animeDao.deleteFavoriteById(anime.id)
        } else {
            animeDao.insertFavorite(
                FavoriteEntity(
                    animeId = anime.id,
                    title = anime.title,
                    japaneseTitle = anime.japaneseTitle,
                    posterUrl = anime.posterUrl,
                    rating = anime.rating,
                    genres = anime.genres.joinToString(", "),
                    releaseYear = anime.releaseYear,
                    addedAt = System.currentTimeMillis()
                )
            )
        }
    }

    suspend fun removeFavorite(animeId: String) {
        animeDao.deleteFavoriteById(animeId)
    }

    suspend fun saveWatchProgress(
        animeId: String,
        episodeId: String,
        episodeNumber: Int,
        episodeTitle: String,
        positionMs: Long,
        durationMs: Long
    ) {
        animeDao.saveWatchProgress(
            WatchProgressEntity(
                animeId = animeId,
                episodeId = episodeId,
                episodeNumber = episodeNumber,
                episodeTitle = episodeTitle,
                positionMs = positionMs,
                durationMs = durationMs,
                lastWatchedAt = System.currentTimeMillis()
            )
        )
    }

    suspend fun clearWatchHistory() {
        animeDao.clearAllWatchHistory()
    }
}
