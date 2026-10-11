import React, { useState, useEffect } from 'react';
import { 
  getAllAnime, 
  getSeasonsByAnime, 
  saveSeason, 
  deleteSeason,
  getEpisodesBySeason,
  saveEpisode,
  deleteEpisode
} from '../services/animeService.ts';
import { AnimeRecord, SeasonRecord, EpisodeRecord, ContentStatus, VideoSourceType } from '../types/anime.ts';
import { 
  Plus, 
  Layers, 
  Film, 
  Play, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Video
} from 'lucide-react';

interface SeasonEpisodeManagerProps {
  initialAnime?: AnimeRecord | null;
}

export const SeasonEpisodeManager: React.FC<SeasonEpisodeManagerProps> = ({ initialAnime }) => {
  const [allAnime, setAllAnime] = useState<AnimeRecord[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<AnimeRecord | null>(initialAnime || null);
  
  const [seasons, setSeasons] = useState<SeasonRecord[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<SeasonRecord | null>(null);
  
  const [episodes, setEpisodes] = useState<EpisodeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Season Modal State
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [seasonFormData, setSeasonFormData] = useState<SeasonRecord>({
    id: '',
    animeId: '',
    seasonNumber: 1,
    title: 'Season 1',
    description: '',
    releaseYear: 2024,
    status: 'published'
  });
  const [isEditingSeason, setIsEditingSeason] = useState(false);

  // Episode Modal State
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [episodeFormData, setEpisodeFormData] = useState<EpisodeRecord>({
    id: '',
    animeId: '',
    seasonId: '',
    episodeNumber: 1,
    title: '',
    synopsis: '',
    duration: '24m',
    thumbnailUrl: '',
    videoUrl: '',
    sourceType: 'mp4',
    status: 'published'
  });
  const [isEditingEpisode, setIsEditingEpisode] = useState(false);
  const [episodeFormError, setEpisodeFormError] = useState<string | null>(null);

  // Video Preview Player Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [previewEpisodeTitle, setPreviewEpisodeTitle] = useState<string>('');

  // Delete Confirmations
  const [deleteSeasonTarget, setDeleteSeasonTarget] = useState<SeasonRecord | null>(null);
  const [deleteEpisodeTarget, setDeleteEpisodeTarget] = useState<EpisodeRecord | null>(null);

  // Load all anime titles on mount
  useEffect(() => {
    const loadAll = async () => {
      const list = await getAllAnime();
      setAllAnime(list);
      if (!selectedAnime && list.length > 0) {
        setSelectedAnime(list[0]);
      }
    };
    loadAll();
  }, []);

  // When selected anime changes, load seasons
  useEffect(() => {
    if (selectedAnime) {
      loadSeasons(selectedAnime.id);
    } else {
      setSeasons([]);
      setSelectedSeason(null);
      setEpisodes([]);
    }
  }, [selectedAnime]);

  // When selected season changes, load episodes
  useEffect(() => {
    if (selectedAnime && selectedSeason) {
      loadEpisodes(selectedAnime.id, selectedSeason.id);
    } else {
      setEpisodes([]);
    }
  }, [selectedSeason]);

  const loadSeasons = async (animeId: string) => {
    setIsLoading(true);
    try {
      const data = await getSeasonsByAnime(animeId);
      setSeasons(data);
      if (data.length > 0) {
        setSelectedSeason(data[0]);
      } else {
        setSelectedSeason(null);
        setEpisodes([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEpisodes = async (animeId: string, seasonId: string) => {
    setIsLoading(true);
    try {
      const data = await getEpisodesBySeason(animeId, seasonId);
      setEpisodes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Season handlers
  const handleOpenCreateSeason = () => {
    if (!selectedAnime) return;
    const nextNum = seasons.length + 1;
    setSeasonFormData({
      id: `${selectedAnime.id}-s${nextNum}`,
      animeId: selectedAnime.id,
      seasonNumber: nextNum,
      title: `Season ${nextNum}`,
      description: `Official broadcast season ${nextNum}`,
      releaseYear: selectedAnime.releaseYear,
      status: 'published'
    });
    setIsEditingSeason(false);
    setIsSeasonModalOpen(true);
  };

  const handleOpenEditSeason = (season: SeasonRecord) => {
    setSeasonFormData({ ...season });
    setIsEditingSeason(true);
    setIsSeasonModalOpen(true);
  };

  const handleSaveSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnime) return;
    try {
      await saveSeason(seasonFormData, !isEditingSeason);
      setIsSeasonModalOpen(false);
      await loadSeasons(selectedAnime.id);
    } catch (err: any) {
      alert(`Error saving season: ${err.message}`);
    }
  };

  const handleDeleteSeason = async () => {
    if (!deleteSeasonTarget || !selectedAnime) return;
    try {
      await deleteSeason(deleteSeasonTarget.id);
      setDeleteSeasonTarget(null);
      await loadSeasons(selectedAnime.id);
    } catch (err: any) {
      alert(`Error deleting season: ${err.message}`);
    }
  };

  // Episode handlers
  const handleOpenCreateEpisode = () => {
    if (!selectedAnime || !selectedSeason) return;
    const nextEpNum = episodes.length + 1;
    setEpisodeFormData({
      id: `${selectedAnime.id}-s${selectedSeason.seasonNumber}-ep${nextEpNum}`,
      animeId: selectedAnime.id,
      seasonId: selectedSeason.id,
      episodeNumber: nextEpNum,
      title: `Episode ${nextEpNum}: `,
      synopsis: '',
      duration: '24m',
      thumbnailUrl: selectedAnime.posterUrl,
      videoUrl: 'https://storage.googleapis.com/exoplayer-test-media-0/BigBuckBunny_320x180.mp4',
      sourceType: 'mp4',
      status: 'published'
    });
    setIsEditingEpisode(false);
    setEpisodeFormError(null);
    setIsEpisodeModalOpen(true);
  };

  const handleOpenEditEpisode = (episode: EpisodeRecord) => {
    setEpisodeFormData({ ...episode });
    setIsEditingEpisode(true);
    setEpisodeFormError(null);
    setIsEpisodeModalOpen(true);
  };

  const handleSaveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEpisodeFormError(null);

    // Video URL validation
    if (!episodeFormData.videoUrl.trim().startsWith('https://')) {
      setEpisodeFormError('Authorized video URL must use secure HTTPS protocol (https://).');
      return;
    }

    try {
      await saveEpisode(episodeFormData, !isEditingEpisode);
      setIsEpisodeModalOpen(false);
      if (selectedAnime && selectedSeason) {
        await loadEpisodes(selectedAnime.id, selectedSeason.id);
      }
    } catch (err: any) {
      setEpisodeFormError(err.message || 'Error saving episode');
    }
  };

  const handleDeleteEpisode = async () => {
    if (!deleteEpisodeTarget || !selectedAnime || !selectedSeason) return;
    try {
      await deleteEpisode(deleteEpisodeTarget.id);
      setDeleteEpisodeTarget(null);
      await loadEpisodes(selectedAnime.id, selectedSeason.id);
    } catch (err: any) {
      alert(`Error deleting episode: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
          Seasons & Episodes Manager
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Assign broadcast seasons and valid licensed video streaming endpoints
        </p>
      </div>

      {/* Select Anime Bar */}
      <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            Selected Anime:
          </label>
          <select
            className="form-select"
            style={{ maxWidth: '380px' }}
            value={selectedAnime?.id || ''}
            onChange={(e) => {
              const found = allAnime.find((a) => a.id === e.target.value);
              setSelectedAnime(found || null);
            }}
          >
            {allAnime.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.releaseYear}) • {a.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedAnime ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Please select an anime from the dropdown above to manage its seasons and episodes.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
          {/* Left Column: Seasons List */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Seasons ({seasons.length})</h3>
              <button onClick={handleOpenCreateSeason} className="btn btn-primary btn-sm" title="Add Season">
                <Plus size={14} /> Add
              </button>
            </div>

            {seasons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                No seasons created yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {seasons.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSeason(s)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      backgroundColor: selectedSeason?.id === s.id ? 'var(--primary-purple)' : 'var(--bg-navy)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: selectedSeason?.id === s.id ? '#fff' : 'var(--text-primary)' }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: '11px', color: selectedSeason?.id === s.id ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                        Year: {s.releaseYear} • {s.status}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenEditSeason(s); }}
                        style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteSeasonTarget(s); }}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Episodes List */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700' }}>
                  {selectedSeason ? `${selectedSeason.title} Episodes` : 'Select a Season'}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  Total {episodes.length} episodes configured
                </p>
              </div>

              {selectedSeason && (
                <button onClick={handleOpenCreateEpisode} className="btn btn-primary btn-sm">
                  <Plus size={14} /> Add Episode
                </button>
              )}
            </div>

            {!selectedSeason ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Please select or create a season on the left to manage its episodes.
              </div>
            ) : episodes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No episodes added to {selectedSeason.title} yet. Click "Add Episode" above.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title & Synopsis</th>
                      <th>Duration</th>
                      <th>Source Type</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {episodes.map((ep) => (
                      <tr key={ep.id}>
                        <td style={{ fontWeight: '800', color: 'var(--primary-purple)', width: '40px' }}>
                          {ep.episodeNumber}
                        </td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{ep.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ep.synopsis || 'No synopsis'}
                          </div>
                        </td>
                        <td>{ep.duration}</td>
                        <td>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                            {ep.sourceType}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${ep.status}`}>
                            {ep.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => {
                                setPreviewVideoUrl(ep.videoUrl);
                                setPreviewEpisodeTitle(ep.title);
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Test Stream Playback"
                            >
                              <Play size={13} /> Test
                            </button>
                            <button
                              onClick={() => handleOpenEditEpisode(ep)}
                              className="btn btn-secondary btn-sm"
                              title="Edit Episode"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteEpisodeTarget(ep)}
                              className="btn btn-danger btn-sm"
                              title="Delete Episode"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Season Modal */}
      {isSeasonModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
              {isEditingSeason ? 'Edit Season' : 'Add New Season'}
            </h3>
            <form onSubmit={handleSaveSeason}>
              <div className="form-group">
                <label className="form-label">Season Number *</label>
                <input
                  type="number"
                  className="form-input"
                  value={seasonFormData.seasonNumber}
                  onChange={(e) => setSeasonFormData({ ...seasonFormData, seasonNumber: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Season Title *</label>
                <input
                  className="form-input"
                  value={seasonFormData.title}
                  onChange={(e) => setSeasonFormData({ ...seasonFormData, title: e.target.value })}
                  placeholder="Season 1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={seasonFormData.description}
                  onChange={(e) => setSeasonFormData({ ...seasonFormData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={seasonFormData.status}
                  onChange={(e) => setSeasonFormData({ ...seasonFormData, status: e.target.value as ContentStatus })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setIsSeasonModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Season
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Episode Modal */}
      {isEpisodeModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
              {isEditingEpisode ? 'Edit Episode' : 'Add New Episode'}
            </h3>

            {episodeFormError && (
              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
                {episodeFormError}
              </div>
            )}

            <form onSubmit={handleSaveEpisode}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Episode # *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={episodeFormData.episodeNumber}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, episodeNumber: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Episode Title *</label>
                  <input
                    className="form-input"
                    value={episodeFormData.title}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, title: e.target.value })}
                    placeholder="Awakening of the Starlight Edge"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Episode Synopsis</label>
                <textarea
                  className="form-textarea"
                  value={episodeFormData.synopsis}
                  onChange={(e) => setEpisodeFormData({ ...episodeFormData, synopsis: e.target.value })}
                  rows={2}
                  placeholder="Short description of this episode..."
                />
              </div>

              {/* Video URL Input & Source Type */}
              <div className="form-group">
                <label className="form-label">Authorized Video Playback URL (HTTPS MP4 / HLS) *</label>
                <input
                  className="form-input"
                  value={episodeFormData.videoUrl}
                  onChange={(e) => setEpisodeFormData({ ...episodeFormData, videoUrl: e.target.value })}
                  placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                  required
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Must be an authorized, valid streaming media endpoint compatible with Android ExoPlayer.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    className="form-input"
                    value={episodeFormData.duration}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, duration: e.target.value })}
                    placeholder="24m"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Source Format</label>
                  <select
                    className="form-select"
                    value={episodeFormData.sourceType}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, sourceType: e.target.value as VideoSourceType })}
                  >
                    <option value="mp4">MP4 Video Stream</option>
                    <option value="hls">HLS / m3u8 Playlist</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={episodeFormData.status}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, status: e.target.value as ContentStatus })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setIsEpisodeModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Stream Test Player Modal */}
      {previewVideoUrl && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={18} color="var(--primary-purple)" />
                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Stream Preview: {previewEpisodeTitle}</h3>
              </div>
              <button onClick={() => setPreviewVideoUrl(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', marginBottom: '12px' }}>
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                style={{ width: '100%', height: 'auto', maxHeight: '360px', display: 'block' }}
              >
                Your browser does not support HTML5 video preview.
              </video>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
              <strong>Endpoint:</strong> {previewVideoUrl}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setPreviewVideoUrl(null)} className="btn btn-secondary btn-sm">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Season Modal */}
      {deleteSeasonTarget && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Delete {deleteSeasonTarget.title}?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Are you sure you want to remove this season?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setDeleteSeasonTarget(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteSeason} className="btn btn-danger">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Episode Modal */}
      {deleteEpisodeTarget && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Delete Episode #{deleteEpisodeTarget.episodeNumber}?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Are you sure you want to remove "{deleteEpisodeTarget.title}" from Firestore?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setDeleteEpisodeTarget(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteEpisode} className="btn btn-danger">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
