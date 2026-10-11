package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.data.repository.AnimeCatalog
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class ExampleRobolectricTest {

    @Test
    fun `read string from context`() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val appName = context.getString(R.string.app_name)
        assertEquals("AnimeVerse", appName)
    }

    @Test
    fun `verify anime catalog size and structure`() {
        val catalog = AnimeCatalog.catalog
        assertTrue("Catalog should have at least 12 anime entries", catalog.size >= 12)
        val celestialBlade = AnimeCatalog.getAnimeById("celestial-blade")
        assertNotNull(celestialBlade)
        assertEquals("Celestial Blade: Zero", celestialBlade?.title)
        assertTrue(celestialBlade?.episodes?.isNotEmpty() == true)
    }
}
