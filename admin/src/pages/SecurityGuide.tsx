import React, { useState } from 'react';
import { Shield, Key, Terminal, Smartphone, Copy, Check, Lock, CheckCircle2 } from 'lucide-react';

export const SecurityGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const securityRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function verifying cryptographically signed custom admin claim
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    // Public / Android App read permissions for published records only
    function isPublished() {
      return resource.data.status == 'published';
    }

    // Anime Collection
    match /anime/{animeId} {
      // Android mobile app and unauthenticated users can read ONLY published anime
      allow read: if isPublished() || isAdmin();
      // Only verified administrators can create, update, or delete anime
      allow write: if isAdmin();
    }

    // Seasons Collection
    match /seasons/{seasonId} {
      allow read: if isPublished() || isAdmin();
      allow write: if isAdmin();
    }

    // Episodes Collection
    match /episodes/{episodeId} {
      allow read: if isPublished() || isAdmin();
      allow write: if isAdmin();
    }
  }
}`;

  const setClaimScript = `// scripts/set-admin-claim.js
// Run from your local terminal or Google Cloud Shell
const admin = require('firebase-admin');

// Initialize with service account credentials from Firebase Console
// Project Settings -> Service accounts -> Generate new private key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const targetEmail = process.argv[2];

if (!targetEmail) {
  console.error("Usage: node scripts/set-admin-claim.js <admin-email>");
  process.exit(1);
}

async function grantAdmin(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    // Set custom claim: { admin: true }
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(\`Success! Admin claim { admin: true } granted to \${email} (UID: \${user.uid})\`);
  } catch (err) {
    console.error("Error setting custom claim:", err.message);
  }
}

grantAdmin(targetEmail);`;

  const androidQuerySnippet = `// In Android AnimeVerse App (Kotlin):
val db = Firebase.firestore

// Fetch only published anime
db.collection("anime")
  .whereEqualTo("status", "published")
  .get()
  .addOnSuccessListener { documents ->
      for (document in documents) {
          Log.d("AnimeVerse", "\${document.id} => \${document.data}")
      }
  }`;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
          Security & Setup Guide
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Zero-trust authorization architecture, Firestore Security Rules, and Android client integration
        </p>
      </div>

      {/* Step 1: Zero-Trust Security Principle */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ padding: '10px', backgroundColor: 'rgba(168, 85, 247, 0.2)', borderRadius: '12px', color: 'var(--primary-purple)' }}>
            <Lock size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              1. The Zero-Trust Administrator Security Model
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Traditional insecure web apps store roles in <code>localStorage</code> or allow anyone to register. In AnimeVerse Admin:
            </p>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.8', marginTop: '8px', paddingLeft: '20px' }}>
              <li>Client-side claims or browser storage are <strong>never trusted</strong>.</li>
              <li>Administrator privileges are verified via <strong>Firebase Custom Claims</strong> (<code>request.auth.token.admin == true</code>), which are signed server-side by Google's private key.</li>
              <li>Even if someone hacks the web UI, Cloud Firestore Security Rules will reject any unauthorized database write operations with <code>PERMISSION_DENIED</code>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step 2: Setting up the First Admin */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>
              2. How to Configure the First Administrator (Step-by-Step)
            </h2>
          </div>
          <button
            onClick={() => copyToClipboard(setClaimScript, 'claim')}
            className="btn btn-secondary btn-sm"
          >
            {copiedKey === 'claim' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copiedKey === 'claim' ? 'Copied Script' : 'Copy Script'}
          </button>
        </div>

        <ol style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '16px' }}>
          <li>Go to the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-purple)' }}>Firebase Console</a> &rarr; <strong>Authentication</strong> &rarr; <strong>Users</strong>.</li>
          <li>Click <strong>Add user</strong> and create your administrator email and a strong password.</li>
          <li>Go to <strong>Project Settings</strong> &rarr; <strong>Service accounts</strong> &rarr; click <strong>Generate new private key</strong>. Save it as <code>admin/scripts/serviceAccountKey.json</code>.</li>
          <li>Run the script from your terminal:
            <div style={{ backgroundColor: '#05030a', padding: '10px 14px', borderRadius: '8px', fontFamily: 'monospace', color: 'var(--accent-cyan)', margin: '8px 0' }}>
              node admin/scripts/set-admin-claim.js "your-admin-email@example.com"
            </div>
          </li>
          <li>Log into the AnimeVerse Admin panel. The dashboard will verify your <code>admin: true</code> token and grant full access.</li>
        </ol>

        <div style={{ backgroundColor: '#05030a', padding: '14px', borderRadius: '10px', overflowX: 'auto', maxHeight: '200px' }}>
          <pre style={{ color: '#c084fc', fontSize: '12px', fontFamily: 'monospace' }}>
            {setClaimScript}
          </pre>
        </div>
      </div>

      {/* Step 3: Firebase Security Rules */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>
              3. Firestore Security Rules (<code>firestore.rules</code>)
            </h2>
          </div>
          <button
            onClick={() => copyToClipboard(securityRulesCode, 'rules')}
            className="btn btn-secondary btn-sm"
          >
            {copiedKey === 'rules' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copiedKey === 'rules' ? 'Copied Rules' : 'Copy Rules'}
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
          These rules are saved at the project root as <code>firestore.rules</code>. They permit the general public and the Android app to read only published titles, while reserving create, edit, publish, and delete operations exclusively for verified administrators.
        </p>

        <div style={{ backgroundColor: '#05030a', padding: '14px', borderRadius: '10px', overflowX: 'auto' }}>
          <pre style={{ color: '#a7f3d0', fontSize: '12px', fontFamily: 'monospace' }}>
            {securityRulesCode}
          </pre>
        </div>
      </div>

      {/* Step 4: Android App Integration */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={20} color="var(--accent-rose)" />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>
              4. Android App Query Compatibility
            </h2>
          </div>
          <button
            onClick={() => copyToClipboard(androidQuerySnippet, 'android')}
            className="btn btn-secondary btn-sm"
          >
            {copiedKey === 'android' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copiedKey === 'android' ? 'Copied Code' : 'Copy Code'}
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
          To load the dynamic catalog inside your companion AnimeVerse Android app, use the exact field schema matching <code>AnimeRecord</code>:
        </p>

        <div style={{ backgroundColor: '#05030a', padding: '14px', borderRadius: '10px', overflowX: 'auto' }}>
          <pre style={{ color: '#fbcfe8', fontSize: '12px', fontFamily: 'monospace' }}>
            {androidQuerySnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
