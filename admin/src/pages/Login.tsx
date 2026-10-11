import React, { useState } from 'react';
import { useAuth } from '../services/authContext.tsx';
import { getSavedConfig, saveConfig } from '../firebase/config.ts';
import { ShieldAlert, KeyRound, Settings, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { user, isAdmin, adminClaimMissing, signIn, signOut, refreshAdminClaim, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Firebase Config State for local adjustments
  const currentConfig = getSavedConfig();
  const [configForm, setConfigForm] = useState(currentConfig);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Access temporarily disabled due to many failed attempts. Try again later.');
      } else {
        setError(err.message || 'Failed to sign in.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is signed in but missing the "admin" claim
  if (user && adminClaimMissing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card" style={{ maxWidth: '580px', width: '100%', borderColor: 'var(--accent-rose)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '10px', borderRadius: '12px', color: 'var(--accent-rose)' }}>
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Admin Authorization Required</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Signed in as: {user.email}</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-navy)', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '10px' }}>
              <strong>Zero-Trust Security Enforcement:</strong> Your Firebase account was authenticated, but it does not have the cryptographically verified <code>admin: true</code> custom claim.
            </p>
            <p style={{ marginBottom: '10px' }}>
              As specified in the security requirements, roles in <code>localStorage</code> or client code are strictly rejected. To grant administrator permissions, run the trusted backend setup script:
            </p>
            <div style={{ backgroundColor: '#05030a', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', color: '#c084fc', wordBreak: 'break-all' }}>
              node scripts/set-admin-claim.js "{user.email}"
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={refreshAdminClaim}
              className="btn btn-primary"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Re-check Admin Status
            </button>
            <button onClick={signOut} className="btn btn-secondary">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            background: 'var(--primary-purple)', 
            borderRadius: '16px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4)'
          }}>
            <KeyRound size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
            AnimeVerse <span style={{ color: 'var(--primary-purple)' }}>Admin</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Private catalog management for AnimeVerse
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(244, 63, 94, 0.15)', 
            border: '1px solid rgba(244, 63, 94, 0.3)', 
            color: 'var(--accent-rose)', 
            padding: '12px 14px', 
            borderRadius: '10px', 
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Administrator Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@animeverse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Project: {currentConfig.projectId || 'Default / Environment'}
          </span>
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="btn btn-secondary btn-sm"
          >
            <Settings size={14} /> Firebase Config
          </button>
        </div>
      </div>

      {/* Firebase Config Modal */}
      {showConfigModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Firebase Project Configuration</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              Set your Firebase Web app credentials from the Firebase Console (Project Settings → General → Web apps).
            </p>

            <div className="form-group">
              <label className="form-label">API Key</label>
              <input
                className="form-input"
                value={configForm.apiKey}
                onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                placeholder="AIzaSy..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Project ID</label>
              <input
                className="form-input"
                value={configForm.projectId}
                onChange={(e) => setConfigForm({ ...configForm, projectId: e.target.value })}
                placeholder="animeverse-app"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Auth Domain</label>
              <input
                className="form-input"
                value={configForm.authDomain}
                onChange={(e) => setConfigForm({ ...configForm, authDomain: e.target.value })}
                placeholder="animeverse-app.firebaseapp.com"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveConfig(configForm)}
                className="btn btn-primary"
              >
                Save & Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
