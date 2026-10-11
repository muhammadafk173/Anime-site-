package com.example.data.repository

import com.example.data.model.Anime
import com.example.data.model.Episode

object AnimeCatalog {
    // Verified, accessible public domain / open test video streams (ExoPlayer test media)
    private const val STREAM_BIG_BUCK = "https://storage.googleapis.com/exoplayer-test-media-0/BigBuckBunny_320x180.mp4"
    private const val STREAM_ELEPHANTS = "https://storage.googleapis.com/exoplayer-test-media-1/mp4/android-screens-25s.mp4"
    private const val STREAM_TEARS_STEEL = "https://storage.googleapis.com/exoplayer-test-media-1/mp4/android-screens-10s.mp4"
    private const val STREAM_SINTEL = "https://storage.googleapis.com/exoplayer-test-media-0/BigBuckBunny_320x180.mp4"
    private const val STREAM_FOR_BIGGER_BLAZES = "https://storage.googleapis.com/exoplayer-test-media-1/mp4/android-screens-25s.mp4"
    private const val STREAM_WE_ARE_GOING = "https://storage.googleapis.com/exoplayer-test-media-1/mp4/android-screens-10s.mp4"

    // High quality themed anime artwork URLs with local fallback handling
    val catalog: List<Anime> = listOf(
        Anime(
            id = "celestial-blade",
            title = "Celestial Blade: Zero",
            japaneseTitle = "天界の刃：ゼロ",
            posterUrl = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
            description = "In a realm where floating celestial islands drift above a violent void, Ren, the last inheritor of the Aether Blade, awakens to find his ancestral sanctum destroyed. Armed with a sword woven from cosmic starlight, he embarks on an odyssey across shattered lands to sever the tether connecting his universe to the Abyss.",
            genres = listOf("Action", "Fantasy", "Adventure"),
            releaseYear = 2024,
            rating = 9.4,
            status = "Ongoing",
            studio = "Mappa Luminance",
            episodeCount = 12,
            isTrending = true,
            isPopular = true,
            isRecentlyAdded = false,
            episodes = listOf(
                Episode(
                    id = "cb-ep-1",
                    number = 1,
                    title = "Awakening of the Starlight Edge",
                    duration = "24m",
                    videoUrl = STREAM_BIG_BUCK,
                    synopsis = "Ren awakens amidst the ruins of the Skyfall Shrine with only fragments of his memory and a glowing celestial katana.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500"
                ),
                Episode(
                    id = "cb-ep-2",
                    number = 2,
                    title = "The Shattered Archipelago",
                    duration = "23m",
                    videoUrl = STREAM_ELEPHANTS,
                    synopsis = "Journeying beyond the safe sanctuary borders, Ren encounters airship scavengers and the terrifying Void Serpents.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500"
                ),
                Episode(
                    id = "cb-ep-3",
                    number = 3,
                    title = "Echoes in the Violet Nebulae",
                    duration = "25m",
                    videoUrl = STREAM_TEARS_STEEL,
                    synopsis = "A mysterious priestess named Lyra reveals the ancient prophecy of the Blade and offers guidance through the tempest.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500"
                ),
                Episode(
                    id = "cb-ep-4",
                    number = 4,
                    title = "Trial of the Astral Gate",
                    duration = "24m",
                    videoUrl = STREAM_SINTEL,
                    synopsis = "To unlock the second seal of his blade, Ren must face guardians of pure starlight energy.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500"
                )
            )
        ),
        Anime(
            id = "starlight-odyssey",
            title = "Starlight Odyssey: The Cosmic Guard",
            japaneseTitle = "スターライト・オデッセイ 宇宙の守護者",
            posterUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
            description = "Centuries after humanity discovered the Lumina Leylines traversing intergalactic corridors, young guardian Lunaria discovers a celestial crystal containing the soul of a primordial stellar god. Together with a renegade crew, she voyages to prevent the eclipse of all galaxies.",
            genres = listOf("Fantasy", "Sci-Fi", "Adventure"),
            releaseYear = 2024,
            rating = 9.1,
            status = "Ongoing",
            studio = "Galaxy Animation",
            episodeCount = 24,
            isTrending = true,
            isPopular = true,
            isRecentlyAdded = false,
            episodes = listOf(
                Episode(
                    id = "so-ep-1",
                    number = 1,
                    title = "Call of the Cosmic Staff",
                    duration = "24m",
                    videoUrl = STREAM_SINTEL,
                    synopsis = "Lunaria passes the planetary trial and is chosen by the ancient Star Staff.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500"
                ),
                Episode(
                    id = "so-ep-2",
                    number = 2,
                    title = "Voyage Beyond the Solar Ring",
                    duration = "22m",
                    videoUrl = STREAM_TEARS_STEEL,
                    synopsis = "The crew of the astral frigate 'Zephyr' escapes the shadow blockade and enters warp space.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500"
                ),
                Episode(
                    id = "so-ep-3",
                    number = 3,
                    title = "The Crystal Citadel",
                    duration = "24m",
                    videoUrl = STREAM_FOR_BIGGER_BLAZES,
                    synopsis = "Docking at an abandoned crystal station, the guardians uncover records of the first stellar cataclysm.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500"
                )
            )
        ),
        Anime(
            id = "neon-ronin",
            title = "Neon Ronin: Neo-Kyoto 2099",
            japaneseTitle = "ネオン浪人：ネオ京都2099",
            posterUrl = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
            description = "Beneath the perpetual rain and flickering holographic billboards of Neo-Kyoto, augmented mercenary Jin lives by an ancient bushido code that mega-corporations have long forgotten. When a young whistleblower carrying incriminating AI telemetry hires him for protection, the entire cyberpunk underworld mobilizes to hunt them down.",
            genres = listOf("Sci-Fi", "Action"),
            releaseYear = 2023,
            rating = 8.8,
            status = "Completed",
            studio = "CyberPulse Studios",
            episodeCount = 12,
            isTrending = false,
            isPopular = true,
            isRecentlyAdded = false,
            episodes = listOf(
                Episode(
                    id = "nr-ep-1",
                    number = 1,
                    title = "Rain Over Sector 9",
                    duration = "25m",
                    videoUrl = STREAM_TEARS_STEEL,
                    synopsis = "Jin accepts a lucrative contract that quickly turns into an ambush by cybernetic assassins.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500"
                ),
                Episode(
                    id = "nr-ep-2",
                    number = 2,
                    title = "High-Voltage Bushido",
                    duration = "24m",
                    videoUrl = STREAM_BIG_BUCK,
                    synopsis = "Rooftop chases and katana duels erupt across the neon-drenched skyscrapers.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500"
                )
            )
        ),
        Anime(
            id = "alchemist-solaria",
            title = "The Alchemist of Solaria",
            japaneseTitle = "ソラリアの錬金術師",
            posterUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
            description = "At the prestigious Royal Academy of Solaria, students compete to master arcane elemental synthesis. Emi, a commoner with an unconventional talent for combining organic botany with golden alchemy, turns academic tradition upside down while unraveling the forbidden secret behind the kingdom's prosperity.",
            genres = listOf("Fantasy", "Adventure", "Comedy"),
            releaseYear = 2024,
            rating = 8.7,
            status = "Ongoing",
            studio = "Silver Sun Animation",
            episodeCount = 13,
            isTrending = false,
            isPopular = false,
            isRecentlyAdded = true,
            episodes = listOf(
                Episode(
                    id = "as-ep-1",
                    number = 1,
                    title = "Sparks, Sprouts, and Gold",
                    duration = "23m",
                    videoUrl = STREAM_ELEPHANTS,
                    synopsis = "Emi arrives late to the entrance ceremony and accidentally creates a sentient golden rose.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500"
                ),
                Episode(
                    id = "as-ep-2",
                    number = 2,
                    title = "The Rivalry of Potion Vials",
                    duration = "24m",
                    videoUrl = STREAM_BIG_BUCK,
                    synopsis = "Noble prodigy Lucas challenges Emi to a brewing duel with high stakes.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500"
                )
            )
        ),
        Anime(
            id = "whispers-sakura",
            title = "Whispers of the Sakura Realm",
            japaneseTitle = "桜の国の囁き",
            posterUrl = "https://images.unsplash.com/photo-1528164344705-475426879c0d?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1528164344705-475426879c0d?w=1200&auto=format&fit=crop&q=80",
            description = "During the spring festival in a hillside town surrounded by eternal cherry blossoms, high school student Haruto meets Shiori, a quiet girl who can hear the memories retained by ancient trees. As their hearts grow closer, Haruto realizes that Shiori belongs to a transient spirit world that only appears once every hundred years.",
            genres = listOf("Romance", "Fantasy"),
            releaseYear = 2023,
            rating = 9.0,
            status = "Completed",
            studio = "Kyoto Bloom Works",
            episodeCount = 12,
            isTrending = true,
            isPopular = false,
            isRecentlyAdded = false,
            episodes = listOf(
                Episode(
                    id = "ws-ep-1",
                    number = 1,
                    title = "Petals Caught in the Wind",
                    duration = "24m",
                    videoUrl = STREAM_WE_ARE_GOING,
                    synopsis = "Haruto crosses the red bridge and hears a flute melody that leads him to Shiori.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1528164344705-475426879c0d?w=500"
                ),
                Episode(
                    id = "ws-ep-2",
                    number = 2,
                    title = "The Thousand-Year Shrine",
                    duration = "23m",
                    videoUrl = STREAM_SINTEL,
                    synopsis = "A sudden downpour traps the pair under the shrine roof, sparking a gentle conversation.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500"
                )
            )
        ),
        Anime(
            id = "guild-of-fools",
            title = "Guild of Fools & Fortune",
            japaneseTitle = "愚者と幸運のギルド",
            posterUrl = "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
            description = "Tired of dying in epic boss battles, former legendary hero Kazuo founds a low-ranked adventurer guild dedicated solely to odd jobs, tavern catering, and avoiding demon lords at all costs. Naturally, every simple task they accept accidentally uncovers world-ending conspiracies.",
            genres = listOf("Comedy", "Adventure", "Fantasy"),
            releaseYear = 2024,
            rating = 8.6,
            status = "Ongoing",
            studio = "Laughter Gate Anime",
            episodeCount = 12,
            isTrending = false,
            isPopular = true,
            isRecentlyAdded = true,
            episodes = listOf(
                Episode(
                    id = "gf-ep-1",
                    number = 1,
                    title = "We Just Wanted to Deliver Cabbages!",
                    duration = "23m",
                    videoUrl = STREAM_BIG_BUCK,
                    synopsis = "A routine vegetable escort quest attracts an army of elite goblin knights and an ancient dragon.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1563089145-599997674d42?w=500"
                ),
                Episode(
                    id = "gf-ep-2",
                    number = 2,
                    title = "Tax Audit at Dungeon Floor 3",
                    duration = "24m",
                    videoUrl = STREAM_FOR_BIGGER_BLAZES,
                    synopsis = "The kingdom's revenue inspector insists on surveying a subterranean labyrinth.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500"
                )
            )
        ),
        Anime(
            id = "code-valkyrie",
            title = "Code Valkyrie: Protocol X",
            japaneseTitle = "コード・ワルキューレ：プロトコルX",
            posterUrl = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
            description = "Deep in Earth's lunar orbit, mechanized flight suits called Valkyries defend humanity against anomalous quantum entities. Commander Kairi pilots the prototype Unit-09, wrestling with the AI core that displays increasing emotional consciousness.",
            genres = listOf("Sci-Fi", "Action"),
            releaseYear = 2023,
            rating = 8.9,
            status = "Completed",
            studio = "Studio Mecha Genesis",
            episodeCount = 26,
            isTrending = false,
            isPopular = false,
            isRecentlyAdded = false,
            episodes = listOf(
                Episode(
                    id = "cv-ep-1",
                    number = 1,
                    title = "Orbital Scramble Alert",
                    duration = "24m",
                    videoUrl = STREAM_TEARS_STEEL,
                    synopsis = "Sirens wail as unidentified dimensional rifts tear open near Moon Base Alpha.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500"
                ),
                Episode(
                    id = "cv-ep-2",
                    number = 2,
                    title = "Sync Rate: 120%",
                    duration = "25m",
                    videoUrl = STREAM_BIG_BUCK,
                    synopsis = "Kairi merges consciousness with Unit-09 during a critical dogfight in the thermosphere.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500"
                )
            )
        ),
        Anime(
            id = "spirit-weaver",
            title = "Spirit Weaver Chrono",
            japaneseTitle = "時の精霊使いクロノ",
            posterUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
            description = "Every hour in the clockwork metropolis of Chronopolis is governed by Spirit Weavers who mend temporal threads. When rogue anomalies cause entire city districts to loop yesterday endlessly, young weaver Noah investigates the enigmatic clock tower at the city's heart.",
            genres = listOf("Action", "Fantasy", "Sci-Fi"),
            releaseYear = 2024,
            rating = 8.8,
            status = "Ongoing",
            studio = "Trigger Clockworks",
            episodeCount = 12,
            isTrending = true,
            isPopular = false,
            isRecentlyAdded = true,
            episodes = listOf(
                Episode(
                    id = "sw-ep-1",
                    number = 1,
                    title = "The Ticking Pendulum",
                    duration = "24m",
                    videoUrl = STREAM_ELEPHANTS,
                    synopsis = "Noah notices that the morning bell chimes twelve times instead of six.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500"
                )
            )
        ),
        Anime(
            id = "astraea-knight",
            title = "Astraea: The Astral Knight",
            japaneseTitle = "アストレア 星辰の騎士",
            posterUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
            description = "Princess Astraea abandons the royal court to take up arms among the northern frontier knights. With her crystalline shield that deflects magical blizzards, she rallies an outnumbered battalion against dark warlords seeking eternal winter.",
            genres = listOf("Action", "Adventure", "Fantasy"),
            releaseYear = 2024,
            rating = 9.2,
            status = "Ongoing",
            studio = "Madhouse Nova",
            episodeCount = 16,
            isTrending = true,
            isPopular = true,
            isRecentlyAdded = false,
            episodes = listOf(
                Episode(
                    id = "ak-ep-1",
                    number = 1,
                    title = "Shield of the Frozen North",
                    duration = "24m",
                    videoUrl = STREAM_BIG_BUCK,
                    synopsis = "Astraea arrives at Fort Frostbite just as the enemy horde breaches the outer trench.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500"
                )
            )
        ),
        Anime(
            id = "midnight-cafe",
            title = "Midnight Cafe of Lost Souls",
            japaneseTitle = "迷い人の真夜中カフェ",
            posterUrl = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80",
            description = "At exactly 00:00 midnight in an obscure alleyway of Tokyo, an old wooden door leads to Cafe Starlight. Spirits, wandering ghosts, and stressed salarymen sit side by side to drink freshly brewed matcha lattes served by a demon barista with a heart of gold.",
            genres = listOf("Comedy", "Fantasy"),
            releaseYear = 2022,
            rating = 8.9,
            status = "Completed",
            studio = "Clover Cafe Works",
            episodeCount = 12,
            isTrending = false,
            isPopular = true,
            isRecentlyAdded = false,
            episodes = listOf(
                Episode(
                    id = "mc-ep-1",
                    number = 1,
                    title = "Matcha for a Phantom Samurai",
                    duration = "23m",
                    videoUrl = STREAM_WE_ARE_GOING,
                    synopsis = "A samurai ghost orders his first cappuccino and causes comedic chaos.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500"
                )
            )
        ),
        Anime(
            id = "echoes-parallel-sky",
            title = "Echoes Across Parallel Sky",
            japaneseTitle = "並行世界の空に響く音",
            posterUrl = "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
            description = "Two musicians separated by parallel dimensional planes discover that the frequencies of their guitars resonate through a mysterious antique radio receiver. They exchange melodies and letters through songs, falling in love across reality barriers.",
            genres = listOf("Romance", "Sci-Fi"),
            releaseYear = 2023,
            rating = 9.3,
            status = "Completed",
            studio = "CoMix Wave Vibes",
            episodeCount = 10,
            isTrending = false,
            isPopular = true,
            isRecentlyAdded = false,
            episodes = listOf(
                Episode(
                    id = "eps-ep-1",
                    number = 1,
                    title = "The Frequency at 88.5 MHz",
                    duration = "24m",
                    videoUrl = STREAM_SINTEL,
                    synopsis = "Takuya tunes his vintage radio amplifier and hears an unfamiliar voice singing his unfinished chorus.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500"
                )
            )
        ),
        Anime(
            id = "dragon-sovereign",
            title = "Dragon Sovereign: Reborn",
            japaneseTitle = "竜の覇王：再生",
            posterUrl = "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80",
            description = "Betrayed by the supreme gods after uniting the continent, the ancient Dragon Sovereign reincarnates a thousand years later as a peasant boy with dragon blood in his veins. Keeping his identity concealed, he climbs the ranks of the continent's battle colosseum.",
            genres = listOf("Action", "Fantasy", "Adventure"),
            releaseYear = 2024,
            rating = 8.9,
            status = "Ongoing",
            studio = "Wit Wyvern",
            episodeCount = 24,
            isTrending = true,
            isPopular = true,
            isRecentlyAdded = true,
            episodes = listOf(
                Episode(
                    id = "ds-ep-1",
                    number = 1,
                    title = "Ashes of the Sovereign",
                    duration = "25m",
                    videoUrl = STREAM_BIG_BUCK,
                    synopsis = "Ryu awakens in a remote mountain hamlet and tests his latent draconic flame.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500"
                )
            )
        ),
        Anime(
            id = "quantum-high",
            title = "Quantum High: Club of Anomalies",
            japaneseTitle = "量子高校：特異点同好会",
            posterUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
            bannerUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
            description = "At Oshima Academy, physics rules occasionally stop working for three eccentric club members. Every Thursday after school, gravity flips, homework solves itself backwards in time, and the tea sets hover politely in mid-air.",
            genres = listOf("Comedy", "Sci-Fi"),
            releaseYear = 2024,
            rating = 8.5,
            status = "Ongoing",
            studio = "Doga Kobo Oddities",
            episodeCount = 12,
            isTrending = false,
            isPopular = false,
            isRecentlyAdded = true,
            episodes = listOf(
                Episode(
                    id = "qh-ep-1",
                    number = 1,
                    title = "Newton Apologizes for Room 304",
                    duration = "22m",
                    videoUrl = STREAM_FOR_BIGGER_BLAZES,
                    synopsis = "Kenichi joins the club looking for free snacks and ends up pinned to the ceiling.",
                    thumbnailUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500"
                )
            )
        )
    )

    fun getAnimeById(id: String): Anime? = catalog.find { it.id == id }

    fun getGenres(): List<String> = listOf(
        "All",
        "Action",
        "Adventure",
        "Comedy",
        "Fantasy",
        "Romance",
        "Sci-Fi"
    )
}
