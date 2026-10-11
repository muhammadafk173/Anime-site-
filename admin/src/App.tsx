import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/authContext.tsx';
import { Login } from './pages/Login.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AnimeList } from './pages/AnimeList.tsx';
import { SeasonEpisodeManager } from './pages/SeasonEpisodeManager.tsx';
import { SecurityGuide } from './pages/SecurityGuide.tsx';
import { AnimeRecord } from './types/anime.ts';
import { 
  Tv, 
  LayoutDashboard, 
  Layers, 
  ShieldCheck, 
  LogOut, 
  Film, 
  Sparkles,
  UserCheck
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'anime' | 'seasons' | 'guide'>('dashboard');
  
  // State for navigating between anime list and season manager or editing
  const [selectedAnimeForSeasons, setSelectedAnimeForSeasons] = useState<AnimeRecord | null>(null);
  const [selectedAnimeForEdit, setSelectedAnimeForEdit] = useState<AnimeRecord | null>(null);

  // If not authenticated or still checking, Login component handles this
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--primary-purple)', fontSize: '16px', fontWeight: '600' }}>
          Verifying administrator credentials...
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Login />;
  }

  const handleSelectAnimeForSeasons = (anime: AnimeRecord) => {
    setSelectedAnimeForSeasons(anime);
    setCurrentTab('seasons');
  };

  const handleEditAnimeFromDashboard = (anime: AnimeRecord) => {
    setSelectedAnimeForEdit(anime);
    setCurrentTab('anime');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '4px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            background: 'var(--primary-purple)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)'
          }}>
            <Tv size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>
              Anime<span style={{ color: 'var(--primary-purple)' }}>Verse</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
              Admin Control
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1' }}>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('anime')}
            className={`nav-item ${currentTab === 'anime' ? 'active' : ''}`}
          >
            <Film size={18} />
            <span>Anime Catalog</span>
          </button>

          <button
            onClick={() => setCurrentTab('seasons')}
            className={`nav-item ${currentTab === 'seasons' ? 'active' : ''}`}
          >
            <Layers size={18} />
            <span>Seasons & Episodes</span>
          </button>

          <button
            onClick={() => setCurrentTab('guide')}
            className={`nav-item ${currentTab === 'guide' ? 'active' : ''}`}
          >
            <ShieldCheck size={18} />
            <span>Security & Rules</span>
          </button>
        </nav>

        {/* Bottom User Profile & Sign Out */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(16, 185, 129, 0.15)', 
              color: 'var(--accent-emerald)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <UserCheck size={16} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                Verified Administrator
              </div>
            </div>
          </div>

          <button
            onClick={signOut}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {currentTab === 'dashboard' && (
          <Dashboard 
            onNavigate={(tab: any) => setCurrentTab(tab)} 
            onEditAnime={handleEditAnimeFromDashboard}
          />
        )}

        {currentTab === 'anime' && (
          <AnimeList 
            onSelectAnimeForSeasons={handleSelectAnimeForSeasons}
            selectedAnimeForEdit={selectedAnimeForEdit}
            onClearSelectedEdit={() => setSelectedAnimeForEdit(null)}
          />
        )}

        {currentTab === 'seasons' && (
          <SeasonEpisodeManager initialAnime={selectedAnimeForSeasons} />
        )}

        {currentTab === 'guide' && (
          <SecurityGuide />
        )}
      </main>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AdminLayout />
    </AuthProvider>
  );
}

export default App;
