const admin = require('firebase-admin');

const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();

(async () => {
  try {
    await db.collection('releases').add({
      release: process.env.RELEASE_VERSION,
      link: process.env.RELEASE_URL,
      project: process.env.REPO_NAME
    });
    console.log('Data successfully written to Firestore!');
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    process.exit(1);
  }
})();
