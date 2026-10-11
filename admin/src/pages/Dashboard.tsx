import React, { useEffect, useState } from 'react';
import { getDashboardStats, getAllAnime, seedInitialCatalog } from '../services/animeService.ts';
import { DashboardStats, AnimeRecord } from '../types/anime.ts';
import { 
  Tv, 
  CheckCircle2, 
  FileEdit, 
  Layers, 
  Film, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  Database,
  Smartphone
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onEditAnime: (anime: AnimeRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onEditAnime }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnime: 0,
    publishedAnime: 0,
    draftAnime: 0,
    totalSeasons: 0,
    totalEpisodes: 0,
    publishedEpisodes: 0
  });
  const [recentAnime, setRecentAnime] = useState<AnimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [s, list] = await Promise.all([
        getDashboardStats(),
        getAllAnime()
      ]);
      setStats(s);
      setRecentAnime(list.slice(0, 6));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedSuccess(null);
    try {
      const count = await seedInitialCatalog();
      setSeedSuccess(`Successfully seeded ${count} anime titles, seasons, and licensed demo episodes into Firestore!`);
      await loadData();
    } catch (err: any) {
      alert(`Seeding failed: ${err.message}. Make sure your Firestore rules allow admin writes or check console.`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
            Catalog Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Real-time status of your Cloud Firestore media database
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={loadData} className="btn btn-secondary btn-sm" disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={handleSeed} className="btn btn-primary btn-sm" disabled={isSeeding}>
            <Sparkles size={14} /> {isSeeding ? 'Seeding...' : 'Seed Sample Catalog'}
          </button>
        </div>
      </div>

      {seedSuccess && (
        <div style={{ 
          backgroundColor: 'rgba(16, 185, 129, 0.15)', 
          border: '1px solid rgba(16, 185, 129, 0.3)', 
          color: 'var(--accent-emerald)', 
          padding: '14px 18px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px'
        }}>
          <CheckCircle2 size={18} />
          {seedSuccess}
        </div>
      )}

      {/* Real Statistics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-purple)', marginBottom: '12px' }}>
            <Tv size={22} />
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Anime</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
            {stats.totalAnime}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Total titles cataloged
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)', marginBottom: '12px' }}>
            <CheckCircle2 size={22} />
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Live</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--accent-emerald)' }}>
            {stats.publishedAnime}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Published & public
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-amber)', marginBottom: '12px' }}>
            <FileEdit size={22} />
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Draft</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--accent-amber)' }}>
            {stats.draftAnime}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Hidden draft titles
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
            <Layers size={22} />
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Seasons</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
            {stats.totalSeasons}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Broadcast seasons
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--purple-light)', marginBottom: '12px' }}>
            <Film size={22} />
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Episodes</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
            {stats.totalEpisodes}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {stats.publishedEpisodes} published streams
          </div>
        </div>
      </div>

      {/* Android Compatibility & Architecture Banner */}
      <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, #140e2e 0%, #1e1447 100%)', borderColor: 'var(--primary-purple)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '12px', backgroundColor: 'rgba(168, 85, 247, 0.2)', borderRadius: '12px', color: 'var(--primary-purple)' }}>
            <Smartphone size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>
              AnimeVerse Android App Compatibility
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', maxWidth: '880px' }}>
              The Android streaming app queries the <code>anime</code>, <code>seasons</code>, and <code>episodes</code> collections directly using <code>whereEqualTo("status", "published")</code>. Draft entries remain completely invisible to mobile users and are protected by Firebase Security Rules.
            </p>
          </div>
        </div>
      </div>

      {/* Recently Added Anime Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Anime Catalog Entries</h2>
          <button onClick={() => onNavigate('anime')} className="btn btn-secondary btn-sm">
            View All Anime <ArrowRight size={14} />
          </button>
        </div>

        {recentAnime.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Database size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p>No anime records found in Firestore yet.</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>Click "Seed Sample Catalog" above or add a new title manually.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title & Japanese Name</th>
                  <th>Genres</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentAnime.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: '60px' }}>
                      <img 
                        src={item.posterUrl} 
                        alt={item.title} 
                        style={{ width: '42px', height: '60px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#090714' }}
                        onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100'; }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.title}</div>
                      {item.japaneseTitle && (
                        <div style={{ fontSize: '12px', color: 'var(--purple-light)' }}>{item.japaneseTitle}</div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {item.genres.slice(0, 2).map((g) => (
                          <span key={g} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{item.releaseYear}</td>
                    <td>
                      <span className={`badge badge-${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => onEditAnime(item)}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
