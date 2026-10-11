/**
 * AnimeVerse Admin Custom Claim Setup Script
 *
 * This script runs in a trusted administrative environment (such as your local machine
 * or Google Cloud Shell) and uses the Firebase Admin SDK to grant the { admin: true }
 * custom claim to an authorized email address.
 *
 * HOW TO RUN:
 * 1. Download service account private key from Firebase Console:
 *    Project Settings -> Service accounts -> Generate new private key
 * 2. Save the downloaded JSON as "serviceAccountKey.json" in this directory.
 * 3. Run:
 *    node scripts/set-admin-claim.js "your-admin-email@example.com"
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error("=================================================================");
  console.error("ERROR: Missing 'serviceAccountKey.json'!");
  console.error("Please place your Firebase service account private key file at:");
  console.error(serviceAccountPath);
  console.error("Get it from: Firebase Console -> Project Settings -> Service accounts");
  console.error("=================================================================");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const targetEmail = process.argv[2];

if (!targetEmail) {
  console.error("Usage: node scripts/set-admin-claim.js <admin-email>");
  console.error("Example: node scripts/set-admin-claim.js admin@animeverse.com");
  process.exit(1);
}

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log(`Found user: ${user.email} (UID: ${user.uid})`);

    // Assign cryptographically verified custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    console.log("-----------------------------------------------------------------");
    console.log(`SUCCESS! Custom claim { admin: true } granted to ${email}.`);
    console.log("The user can now log into the AnimeVerse Web Admin Dashboard with full permissions.");
    console.log("-----------------------------------------------------------------");
    process.exit(0);
  } catch (err) {
    console.error("Error setting custom claim:", err.message);
    process.exit(1);
  }
}

setAdminClaim(targetEmail);
