// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyARLyFqgWVyBf-GsaT7QyL7BSqDhdmGgzs",
  authDomain: "it-stock-f7940.firebaseapp.com",
  projectId: "it-stock-f7940",
  storageBucket: "it-stock-f7940.firebasestorage.app",
  messagingSenderId: "1070153227728",
  appId: "1:1070153227728:web:7c3f804c1ec0f2ac5dedd5",
  measurementId: "G-9KPBNX9KV9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
