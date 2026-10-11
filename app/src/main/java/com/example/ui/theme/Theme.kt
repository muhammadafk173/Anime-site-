package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val AnimeVerseColorScheme = darkColorScheme(
    primary = PurplePrimary,
    onPrimary = Color.White,
    primaryContainer = PurpleContainer,
    onPrimaryContainer = Color(0xFFF3E8FF),
    secondary = PurpleGlow,
    onSecondary = Color(0xFF1E0A3C),
    secondaryContainer = Color(0xFF2E1952),
    onSecondaryContainer = Color(0xFFE9D5FF),
    tertiary = AccentCyan,
    onTertiary = Color(0xFF003548),
    tertiaryContainer = Color(0xFF004D68),
    onTertiaryContainer = Color(0xFFC2E8FF),
    background = BackgroundDark,
    onBackground = TextPrimary,
    surface = SurfaceDark,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceCard,
    onSurfaceVariant = TextSecondary,
    outline = BorderSubtle,
    error = AccentPink,
    onError = Color.White
)

@Composable
fun AnimeVerseTheme(
    amoledMode: Boolean = false,
    content: @Composable () -> Unit
) {
    val colors = if (amoledMode) {
        AnimeVerseColorScheme.copy(
            background = Color(0xFF000000),
            surface = Color(0xFF0A0714),
            surfaceVariant = Color(0xFF120E22)
        )
    } else {
        AnimeVerseColorScheme
    }

    MaterialTheme(
        colorScheme = colors,
        typography = Typography,
        content = content
    )
}
