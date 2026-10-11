export type ContentStatus = 'draft' | 'published';

export type VideoSourceType = 'mp4' | 'hls';

export interface AnimeRecord {
  id: string; // document id (slug or uuid)
  title: string;
  japaneseTitle?: string;
  synopsis: string;
  posterUrl: string;
  bannerUrl: string;
  genres: string[];
  releaseYear: number;
  language: string;
  status: ContentStatus;
  studio?: string;
  rating?: number;
  totalSeasons?: number;
  totalEpisodes?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface SeasonRecord {
  id: string;
  animeId: string;
  seasonNumber: number;
  title: string;
  description: string;
  releaseYear: number;
  status: ContentStatus;
  episodeCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface EpisodeRecord {
  id: string;
  animeId: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  synopsis: string;
  duration: string; // e.g. "24m"
  thumbnailUrl: string;
  videoUrl: string;
  sourceType: VideoSourceType;
  language?: string;
  status: ContentStatus;
  createdAt?: any;
  updatedAt?: any;
}

export interface DashboardStats {
  totalAnime: number;
  publishedAnime: number;
  draftAnime: number;
  totalSeasons: number;
  totalEpisodes: number;
  publishedEpisodes: number;
}
