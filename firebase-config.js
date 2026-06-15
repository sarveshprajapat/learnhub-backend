/* ============================================================
   FIREBASE CONFIGURATION & CLOUD SYNC LAYER
   ------------------------------------------------------------
   1) Replace the firebaseConfig values below with YOUR project's
      config from the Firebase Console
      (Project settings → General → Your apps → Web app).
   2) Enable "Email/Password" sign-in in
      Firebase Console → Authentication → Sign-in method.
   3) Create a Firestore database (Build → Firestore Database →
      Create database, start in production or test mode).
   ============================================================ */

const firebaseConfig = {
    apiKey: "AIzaSyAwk2sQ45hRJfrQE0eQQAX32jtpnZemg3M",
    authDomain: "learnhub-study.firebaseapp.com",
    projectId: "learnhub-study",
    storageBucket: "learnhub-study.firebasestorage.app",
    messagingSenderId: "349301018513",
    appId: "1:349301018513:web:a1ff5faaa9bfe1a0e81430",
    measurementId: "G-68LQP4MPRR"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* ============================================================
   AUTH HELPERS (used by login.html)
   ============================================================ */
const LHAuth = {
  signUp(name, email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then(cred => cred.user.updateProfile({ displayName: name }).then(() => cred));
  },
  signIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  },
  resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  },
  signOut() {
    return auth.signOut();
  },
  currentUser() {
    return auth.currentUser;
  }
};

/* ============================================================
   CLOUD SYNC LAYER
   ------------------------------------------------------------
   All app data lives in localStorage under simple keys (notes,
   flashcards, stats, quizHistory, user, bots, courseProgress,
   darkMode, ...). This layer:
     - On login: pulls the saved JSON blob from Firestore
       (collection "learnhub_users", doc = uid) into localStorage
       so the app boots with the user's cloud data.
     - Patches localStorage.setItem so every local change is
       mirrored to Firestore (debounced) under that user's doc.
   ============================================================ */
const LH_SYNC_KEYS = [
  'notes', 'flashcards', 'quizHistory', 'stats', 'user', 'bots',
  'courseProgress', 'darkMode'
];

let lhSyncTimer = null;
let lhCurrentUid = null;

function lhPushToCloud() {
  if (!lhCurrentUid) return;
  const payload = {};
  LH_SYNC_KEYS.forEach(key => {
    const raw = localStorage.getItem(key);
    if (raw !== null) payload[key] = raw;
  });
  payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  db.collection('learnhub_users').doc(lhCurrentUid).set(payload, { merge: true })
    .catch(err => console.error('Cloud sync error:', err));
}

function lhScheduleSync() {
  clearTimeout(lhSyncTimer);
  lhSyncTimer = setTimeout(lhPushToCloud, 800);
}

// Patch localStorage.setItem so existing Store.set(...) calls also sync to the cloud
const _lhOriginalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function (key, value) {
  _lhOriginalSetItem(key, value);
  if (LH_SYNC_KEYS.includes(key)) lhScheduleSync();
};

/* ============================================================
   AUTH GUARD + DATA BOOTSTRAP
   ------------------------------------------------------------
   This runs immediately on every protected page (index.html).
   It waits for Firebase to report the auth state, redirects to
   login.html if signed out, otherwise pulls cloud data into
   localStorage and then loads script.js dynamically.
   ============================================================ */
(function () {
  // Don't run the guard on the login page itself
  if (document.body && document.body.dataset.page === 'auth') return;

  auth.onAuthStateChanged(function (firebaseUser) {
    if (!firebaseUser) {
      window.location.href = 'login.html';
      return;
    }

    lhCurrentUid = firebaseUser.uid;

    db.collection('learnhub_users').doc(firebaseUser.uid).get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          LH_SYNC_KEYS.forEach(key => {
            if (data[key] !== undefined) {
              _lhOriginalSetItem(key, data[key]);
            }
          });
        }

        // Make sure the display name from Firebase Auth is reflected
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null') || { name: 'You', points: 0 };
        if (firebaseUser.displayName && (storedUser.name === 'You' || !storedUser.name)) {
          storedUser.name = firebaseUser.displayName;
        }
        storedUser.email = firebaseUser.email;
        _lhOriginalSetItem('user', JSON.stringify(storedUser));

        lhInjectAppScript();
        lhUpdateAuthUI(firebaseUser);
      })
      .catch(err => {
        console.error('Failed to load cloud data:', err);
        lhInjectAppScript();
        lhUpdateAuthUI(firebaseUser);
      });
  });
})();

function lhInjectAppScript() {
  if (window.__lhAppLoaded) return;
  window.__lhAppLoaded = true;
  const s = document.createElement('script');
  s.src = 'script.js';
  document.body.appendChild(s);
  const loader = document.getElementById('lhLoadingOverlay');
  if (loader) loader.remove();
}

function lhUpdateAuthUI(firebaseUser) {
  const nameEl = document.getElementById('lhUserName');
  if (nameEl) nameEl.textContent = firebaseUser.displayName || firebaseUser.email;
}

function lhLogout() {
  LHAuth.signOut().then(() => {
    window.location.href = 'login.html';
  });
}

function lhAddAccount() {
  LHAuth.signOut().then(() => {
    window.location.href = 'login.html?mode=signup';
  });
}

function toggleProfileMenu() {
  document.getElementById('profileDropdown').classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const menu = document.getElementById('profileMenu');
  const dropdown = document.getElementById('profileDropdown');
  if (menu && dropdown && !menu.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});