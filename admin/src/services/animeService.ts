import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config.ts';
import { AnimeRecord, SeasonRecord, EpisodeRecord, DashboardStats } from '../types/anime.ts';

const ANIME_COLLECTION = 'anime';
const SEASONS_COLLECTION = 'seasons';
const EPISODES_COLLECTION = 'episodes';

// ---------------- DASHBOARD STATS ----------------

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [animeSnap, seasonsSnap, episodesSnap] = await Promise.all([
      getDocs(collection(db, ANIME_COLLECTION)),
      getDocs(collection(db, SEASONS_COLLECTION)),
      getDocs(collection(db, EPISODES_COLLECTION))
    ]);

    let publishedAnime = 0;
    let draftAnime = 0;
    animeSnap.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'published') publishedAnime++;
      else draftAnime++;
    });

    let publishedEpisodes = 0;
    episodesSnap.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'published') publishedEpisodes++;
    });

    return {
      totalAnime: animeSnap.size,
      publishedAnime,
      draftAnime,
      totalSeasons: seasonsSnap.size,
      totalEpisodes: episodesSnap.size,
      publishedEpisodes
    };
  } catch (err) {
    console.warn('Error fetching stats from Firestore:', err);
    return {
      totalAnime: 0,
      publishedAnime: 0,
      draftAnime: 0,
      totalSeasons: 0,
      totalEpisodes: 0,
      publishedEpisodes: 0
    };
  }
}

// ---------------- ANIME CRUD ----------------

export async function getAllAnime(): Promise<AnimeRecord[]> {
  try {
    const q = query(collection(db, ANIME_COLLECTION));
    const snap = await getDocs(q);
    const list: AnimeRecord[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as AnimeRecord);
    });
    return list;
  } catch (err) {
    console.error('Failed to get anime list:', err);
    throw err;
  }
}

export async function getAnimeById(id: string): Promise<AnimeRecord | null> {
  const snap = await getDoc(doc(db, ANIME_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as AnimeRecord;
}

export async function saveAnime(anime: Omit<AnimeRecord, 'createdAt' | 'updatedAt'>, isNew: boolean): Promise<void> {
  const ref = doc(db, ANIME_COLLECTION, anime.id);
  if (isNew) {
    await setDoc(ref, {
      ...anime,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } else {
    await updateDoc(ref, {
      ...anime,
      updatedAt: serverTimestamp()
    });
  }
}

export async function deleteAnime(id: string): Promise<void> {
  await deleteDoc(doc(db, ANIME_COLLECTION, id));
}

// ---------------- SEASONS CRUD ----------------

export async function getSeasonsByAnime(animeId: string): Promise<SeasonRecord[]> {
  try {
    const q = query(
      collection(db, SEASONS_COLLECTION),
      where('animeId', '==', animeId)
    );
    const snap = await getDocs(q);
    const list: SeasonRecord[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as SeasonRecord);
    });
    return list.sort((a, b) => a.seasonNumber - b.seasonNumber);
  } catch (err) {
    console.error('Failed to get seasons:', err);
    throw err;
  }
}

export async function saveSeason(season: Omit<SeasonRecord, 'createdAt' | 'updatedAt'>, isNew: boolean): Promise<void> {
  const ref = doc(db, SEASONS_COLLECTION, season.id);
  if (isNew) {
    await setDoc(ref, {
      ...season,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } else {
    await updateDoc(ref, {
      ...season,
      updatedAt: serverTimestamp()
    });
  }
}

export async function deleteSeason(id: string): Promise<void> {
  await deleteDoc(doc(db, SEASONS_COLLECTION, id));
}

// ---------------- EPISODES CRUD ----------------

export async function getEpisodesBySeason(animeId: string, seasonId: string): Promise<EpisodeRecord[]> {
  try {
    const q = query(
      collection(db, EPISODES_COLLECTION),
      where('animeId', '==', animeId),
      where('seasonId', '==', seasonId)
    );
    const snap = await getDocs(q);
    const list: EpisodeRecord[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as EpisodeRecord);
    });
    return list.sort((a, b) => a.episodeNumber - b.episodeNumber);
  } catch (err) {
    console.error('Failed to get episodes:', err);
    throw err;
  }
}

export async function getAllEpisodes(): Promise<EpisodeRecord[]> {
  try {
    const snap = await getDocs(collection(db, EPISODES_COLLECTION));
    const list: EpisodeRecord[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as EpisodeRecord);
    });
    return list;
  } catch (err) {
    console.error('Failed to get all episodes:', err);
    return [];
  }
}

export async function saveEpisode(episode: Omit<EpisodeRecord, 'createdAt' | 'updatedAt'>, isNew: boolean): Promise<void> {
  const ref = doc(db, EPISODES_COLLECTION, episode.id);
  if (isNew) {
    await setDoc(ref, {
      ...episode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } else {
    await updateDoc(ref, {
      ...episode,
      updatedAt: serverTimestamp()
    });
  }
}

export async function deleteEpisode(id: string): Promise<void> {
  await deleteDoc(doc(db, EPISODES_COLLECTION, id));
}

// ---------------- SAMPLE SEEDING HELPER ----------------
// Allows the admin to import the initial AnimeVerse sample catalog directly into Firestore!
export async function seedInitialCatalog(): Promise<number> {
  const batch = writeBatch(db);

  const sampleTitles: AnimeRecord[] = [
    {
      id: "celestial-blade",
      title: "Celestial Blade: Zero",
      japaneseTitle: "天界の刃：ゼロ",
      synopsis: "In a realm of floating islands drifting above the cosmic void, Ren wields the sacred Aether Katana against abyssal incursions.",
      posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600",
      bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200",
      genres: ["Action", "Fantasy", "Adventure"],
      releaseYear: 2024,
      language: "Japanese",
      status: "published",
      studio: "Mappa Luminance",
      rating: 9.4,
      totalSeasons: 1,
      totalEpisodes: 4
    },
    {
      id: "starlight-odyssey",
      title: "Starlight Odyssey: The Cosmic Guard",
      japaneseTitle: "スターライト・オデッセイ 宇宙の守護者",
      synopsis: "Centuries after discovering interstellar leylines, guardian Lunaria protects the soul of an ancient stellar deity.",
      posterUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
      bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
      genres: ["Fantasy", "Sci-Fi", "Adventure"],
      releaseYear: 2024,
      language: "Japanese",
      status: "published",
      studio: "Galaxy Animation",
      rating: 9.1,
      totalSeasons: 1,
      totalEpisodes: 3
    },
    {
      id: "neon-ronin",
      title: "Neon Ronin: Neo-Kyoto 2099",
      japaneseTitle: "ネオン浪人：ネオ京都2099",
      synopsis: "Augmented mercenary Jin upholds an ancient bushido code amidst cybernetic syndicates and perpetual neon rain.",
      posterUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
      bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
      genres: ["Sci-Fi", "Action"],
      releaseYear: 2023,
      language: "Japanese",
      status: "published",
      studio: "CyberPulse Studios",
      rating: 8.8,
      totalSeasons: 1,
      totalEpisodes: 2
    }
  ];

  for (const a of sampleTitles) {
    const ref = doc(db, ANIME_COLLECTION, a.id);
    batch.set(ref, {
      ...a,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Seed Season 1
    const sId = `${a.id}-s1`;
    const sRef = doc(db, SEASONS_COLLECTION, sId);
    batch.set(sRef, {
      id: sId,
      animeId: a.id,
      seasonNumber: 1,
      title: "Season 1",
      description: "Official inaugural broadcast season",
      releaseYear: a.releaseYear,
      status: "published",
      episodeCount: 2,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Seed Episode 1
    const ep1Id = `${a.id}-s1-ep1`;
    const ep1Ref = doc(db, EPISODES_COLLECTION, ep1Id);
    batch.set(ep1Ref, {
      id: ep1Id,
      animeId: a.id,
      seasonId: sId,
      episodeNumber: 1,
      title: "Premiere: The Awakening",
      synopsis: "The journey begins as destiny unfolds amidst unexpected encounters.",
      duration: "24m",
      thumbnailUrl: a.posterUrl,
      videoUrl: "https://storage.googleapis.com/exoplayer-test-media-0/BigBuckBunny_320x180.mp4",
      sourceType: "mp4",
      language: a.language,
      status: "published",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  await batch.commit();
  return sampleTitles.length;
}
