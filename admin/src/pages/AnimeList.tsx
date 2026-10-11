import React, { useState, useEffect } from 'react';
import { getAllAnime, saveAnime, deleteAnime } from '../services/animeService.ts';
import { AnimeRecord, ContentStatus } from '../types/anime.ts';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Layers, 
  ExternalLink, 
  X, 
  Check, 
  Image as ImageIcon,
  AlertTriangle,
  Globe,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface AnimeListProps {
  onSelectAnimeForSeasons: (anime: AnimeRecord) => void;
  selectedAnimeForEdit?: AnimeRecord | null;
  onClearSelectedEdit?: () => void;
}

export const AnimeList: React.FC<AnimeListProps> = ({ 
  onSelectAnimeForSeasons, 
  selectedAnimeForEdit,
  onClearSelectedEdit 
}) => {
  const [animeList, setAnimeList] = useState<AnimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<AnimeRecord | null>(null);
  const [publishCandidate, setPublishCandidate] = useState<AnimeRecord | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Form State
  const initialFormState: AnimeRecord = {
    id: '',
    title: '',
    japaneseTitle: '',
    synopsis: '',
    posterUrl: '',
    bannerUrl: '',
    genres: ['Action', 'Fantasy'],
    releaseYear: new Date().getFullYear(),
    language: 'Japanese',
    status: 'draft',
    studio: '',
    rating: 8.5
  };
  const [formData, setFormData] = useState<AnimeRecord>(initialFormState);
  const [genreInput, setGenreInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadAnime = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAnime();
      setAnimeList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnime();
  }, []);

  useEffect(() => {
    if (selectedAnimeForEdit) {
      handleOpenEdit(selectedAnimeForEdit);
      if (onClearSelectedEdit) onClearSelectedEdit();
    }
  }, [selectedAnimeForEdit]);

  const handleOpenCreate = () => {
    setFormData({
      ...initialFormState,
      id: `anime-${Date.now().toString(36)}`
    });
    setGenreInput('');
    setIsEditing(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (anime: AnimeRecord) => {
    setFormData({ ...anime });
    setGenreInput('');
    setIsEditing(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genres.includes(genreInput.trim())) {
      setFormData({
        ...formData,
        genres: [...formData.genres, genreInput.trim()]
      });
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter((g) => g !== genre)
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form Validation
    if (!formData.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!formData.id.trim()) {
      setFormError('Document ID is required.');
      return;
    }
    if (!formData.posterUrl.trim()) {
      setFormError('Poster Image URL is required.');
      return;
    }
    if (formData.genres.length === 0) {
      setFormError('At least one genre is required.');
      return;
    }

    // If publishing a new anime or transitioning from draft to published, require intentional confirmation
    const existing = animeList.find(a => a.id === formData.id);
    if (formData.status === 'published' && (!existing || existing.status === 'draft')) {
      setPublishCandidate({ ...formData });
      return;
    }

    setIsSaving(true);
    try {
      await saveAnime(formData, !isEditing);
      setIsModalOpen(false);
      await loadAnime();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save anime record.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteAnime(deleteCandidate.id);
      setDeleteCandidate(null);
      await loadAnime();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleQuickToggleStatus = async (anime: AnimeRecord) => {
    if (anime.status === 'draft') {
      // Prompt confirmation dialog before publishing to ensure intentional public visibility
      setPublishCandidate(anime);
    } else {
      // Revert from published to draft
      try {
        await saveAnime({ ...anime, status: 'draft' }, false);
        await loadAnime();
      } catch (err: any) {
        alert(`Status update failed: ${err.message}`);
      }
    }
  };

  const handleConfirmPublish = async () => {
    if (!publishCandidate) return;
    setIsPublishing(true);
    try {
      const isNew = !animeList.some(a => a.id === publishCandidate.id);
      await saveAnime({ ...publishCandidate, status: 'published' }, isNew);
      setPublishCandidate(null);
      setIsModalOpen(false);
      await loadAnime();
    } catch (err: any) {
      alert(`Publishing failed: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Filtered List
  const filteredAnime = animeList.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.japaneseTitle && item.japaneseTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
            Anime Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Manage titles, synopsis, images, and publish status
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={16} /> Add New Anime
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Enhanced Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-purple)' }} 
            />
            <input
              type="text"
              placeholder="Search anime by title (e.g. Celestial Blade, Starlight, Neon)..."
              className="form-input"
              style={{ paddingLeft: '42px', paddingRight: searchQuery ? '40px' : '14px', fontSize: '14px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter & Matches Counter */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Filter size={16} style={{ color: 'var(--text-muted)' }} />
              <select
                className="form-select"
                style={{ width: 'auto', padding: '9px 14px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses ({animeList.length})</option>
                <option value="published">Published Only</option>
                <option value="draft">Draft Only</option>
              </select>
            </div>

            <div style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: 'var(--text-muted)',
              background: 'var(--bg-navy)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              whiteSpace: 'nowrap'
            }}>
              {filteredAnime.length} of {animeList.length} shown
            </div>
          </div>
        </div>

        {/* Quick clear search feedback banner */}
        {searchQuery && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Filtering by title: <strong style={{ color: 'var(--primary-purple)' }}>"{searchQuery}"</strong></span>
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline', fontSize: '12px' }}
            >
              Reset search
            </button>
          </div>
        )}
      </div>

      {/* Catalog Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading catalog records...
          </div>
        ) : filteredAnime.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No anime records found</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>Try clearing your search filters or click "Add New Anime".</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>ID & Title</th>
                  <th>Genres</th>
                  <th>Year</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnime.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: '60px' }}>
                      <img 
                        src={item.posterUrl} 
                        alt={item.title} 
                        style={{ width: '46px', height: '64px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#090714' }}
                        onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100'; }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}>{item.title}</div>
                      {item.japaneseTitle && (
                        <div style={{ fontSize: '12px', color: 'var(--purple-light)' }}>{item.japaneseTitle}</div>
                      )}
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>ID: {item.id}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '200px' }}>
                        {item.genres.map((g) => (
                          <span key={g} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '4px' }}>
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{item.releaseYear}</td>
                    <td>⭐ {item.rating || 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => handleQuickToggleStatus(item)}
                        className={`badge badge-${item.status}`}
                        style={{ cursor: 'pointer', border: 'none', background: item.status === 'published' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)' }}
                        title="Click to toggle status"
                      >
                        {item.status}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => onSelectAnimeForSeasons(item)}
                          className="btn btn-secondary btn-sm"
                          title="Manage Seasons & Episodes"
                        >
                          <Layers size={14} /> Episodes
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Anime Details"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(item)}
                          className="btn btn-danger btn-sm"
                          title="Delete Anime"
                        >
                          <Trash2 size={14} />
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

      {/* Add / Edit Anime Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
                {isEditing ? `Edit Anime: ${formData.title}` : 'Add New Anime to Catalog'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Document ID (Slug or Key) *</label>
                  <input
                    className="form-input"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                    placeholder="celestial-blade"
                    disabled={isEditing}
                    required
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unique ID referenced by the Android client</span>
                </div>

                <div className="form-group">
                  <label className="form-label">English / Global Title *</label>
                  <input
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Celestial Blade: Zero"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Japanese Title</label>
                  <input
                    className="form-input"
                    value={formData.japaneseTitle || ''}
                    onChange={(e) => setFormData({ ...formData, japaneseTitle: e.target.value })}
                    placeholder="天界の刃：ゼロ"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Animation Studio</label>
                  <input
                    className="form-input"
                    value={formData.studio || ''}
                    onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                    placeholder="Mappa Luminance"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Synopsis / Description *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="Enter complete plot synopsis..."
                  required
                />
              </div>

              {/* Poster and Banner URLs with live preview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Poster Image URL (Vertical 2:3) *</label>
                  <input
                    className="form-input"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                  {formData.posterUrl && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={formData.posterUrl} alt="Preview" style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Poster preview</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Banner Image URL (Horizontal 16:9)</label>
                  <input
                    className="form-input"
                    value={formData.bannerUrl}
                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    placeholder="https://..."
                  />
                  {formData.bannerUrl && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={formData.bannerUrl} alt="Preview" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Banner preview</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Genres Tag Management */}
              <div className="form-group">
                <label className="form-label">Genres *</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    className="form-input"
                    style={{ maxWidth: '240px' }}
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    placeholder="Add genre (e.g. Sci-Fi)"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddGenre(); } }}
                  />
                  <button type="button" onClick={handleAddGenre} className="btn btn-secondary btn-sm">
                    Add Genre
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {formData.genres.map((g) => (
                    <span key={g} style={{ background: 'var(--border-color)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {g}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveGenre(g)} />
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Release Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) || 2024 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={formData.rating || 9.0}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 9.0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Publish Status *</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="published">Published (Live in Android app)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving to Firestore...' : isEditing ? 'Update Anime' : 'Create Anime'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(244, 63, 94, 0.15)', borderRadius: '12px', color: 'var(--accent-rose)' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Delete Anime?</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              Are you sure you want to delete <strong>"{deleteCandidate.title}"</strong> from Firestore? This action will permanently remove the record.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setDeleteCandidate(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-danger">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {publishCandidate && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px', borderColor: 'var(--accent-emerald)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '14px', color: 'var(--accent-emerald)' }}>
                <Globe size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Publish Anime to Public?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Intentionally make content live</p>
              </div>
            </div>

            {/* Alert Box */}
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '18px',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: '700', marginBottom: '4px' }}>
                <Eye size={16} /> Public Visibility Notice
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                You are about to make <strong>"{publishCandidate.title}"</strong> public. Once published, this anime and its published episodes will be immediately visible to all users on the <strong>AnimeVerse Android app</strong>.
              </p>
            </div>

            {/* Anime Summary Card */}
            <div style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              backgroundColor: 'var(--bg-navy)',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '20px'
            }}>
              {publishCandidate.posterUrl && (
                <img
                  src={publishCandidate.posterUrl}
                  alt={publishCandidate.title}
                  style={{ width: '48px', height: '68px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
              )}
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {publishCandidate.title}
                </div>
                {publishCandidate.japaneseTitle && (
                  <div style={{ fontSize: '12px', color: 'var(--purple-light)' }}>
                    {publishCandidate.japaneseTitle}
                  </div>
                )}
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {publishCandidate.releaseYear} • {publishCandidate.genres.slice(0, 3).join(', ')}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPublishCandidate(null)}
                className="btn btn-secondary"
                disabled={isPublishing}
              >
                Cancel (Keep as Draft)
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}
                disabled={isPublishing}
              >
                <CheckCircle2 size={16} />
                {isPublishing ? 'Publishing...' : 'Confirm & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
