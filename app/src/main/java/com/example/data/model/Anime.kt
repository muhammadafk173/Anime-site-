package com.example.data.model

data class Episode(
    val id: String,
    val number: Int,
    val title: String,
    val duration: String,
    val videoUrl: String,
    val synopsis: String,
    val thumbnailUrl: String
)

data class Anime(
    val id: String,
    val title: String,
    val japaneseTitle: String,
    val posterUrl: String,
    val bannerUrl: String,
    val description: String,
    val genres: List<String>,
    val releaseYear: Int,
    val rating: Double,
    val status: String, // "Ongoing" or "Completed"
    val studio: String,
    val episodeCount: Int,
    val episodes: List<Episode>,
    val isTrending: Boolean = false,
    val isPopular: Boolean = false,
    val isRecentlyAdded: Boolean = false
)
