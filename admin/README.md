# AnimeVerse • Web Admin Dashboard

A private, secure administrative dashboard built with **React**, **TypeScript**, and **Firebase** (Authentication & Cloud Firestore) for managing anime titles, broadcast seasons, and licensed episode streaming sources for the **AnimeVerse** native Android application.

---

## Architecture & Security Model

- **Zero-Trust Security**: No public admin registration. Client-side storage (e.g. `localStorage`) or browser claims are **never** trusted.
- **Firebase Custom Claims**: Only accounts with server-verified `{ admin: true }` tokens can read draft titles and perform write operations.
- **Cloud Firestore Security Rules**: Enforced at the database engine level via `firestore.rules`.
- **Android App Synchronization**: The Android streaming client reads published records (`whereEqualTo("status", "published")`), keeping draft content completely invisible.

---

## Getting Started (Quick Run)

### 1. Install Dependencies
```bash
cd admin
npm install
```

### 2. Configure Firebase
Create a `.env` file inside the `admin` folder or use the in-app **Firebase Config** modal:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Initial Admin Setup (Granting First Admin Access)

1. Open [Firebase Console](https://console.firebase.google.com/) &rarr; **Authentication** &rarr; **Users**.
2. Click **Add user** and create your email (e.g., `admin@animeverse.com`) and password.
3. Open **Project Settings** &rarr; **Service accounts** &rarr; **Generate new private key**. Save this file as `admin/scripts/serviceAccountKey.json`.
4. Install `firebase-admin` and run the helper script:
```bash
npm install firebase-admin
node scripts/set-admin-claim.js "admin@animeverse.com"
```
5. Log in through the admin panel. Your account will now be recognized as a **Verified Administrator** with full CRUD capabilities.

---

## Deploying Firestore Security Rules

Deploy the included `firestore.rules` file to your Firebase project:
```bash
firebase deploy --only firestore:rules
```

---

## Data Model

| Collection | Key Fields | Description |
|---|---|---|
| `/anime/{id}` | `title`, `japaneseTitle`, `synopsis`, `posterUrl`, `bannerUrl`, `genres`, `releaseYear`, `status`, `studio`, `rating` | Core anime series metadata |
| `/seasons/{id}` | `animeId`, `seasonNumber`, `title`, `description`, `releaseYear`, `status` | Broadcast seasons |
| `/episodes/{id}` | `animeId`, `seasonId`, `episodeNumber`, `title`, `synopsis`, `duration`, `thumbnailUrl`, `videoUrl`, `sourceType`, `status` | Episode streaming sources |
