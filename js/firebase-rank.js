// Firebase Ranking - Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rankCollection = collection(db, "ranking");

export async function saveScore(name, score) {
  if(score > 0) {
    await addDoc(rankCollection, { name, score, date: new Date().toISOString() });
  }
}

export async function getTopScores(top = 10) {
  const q = query(rankCollection, orderBy("score", "desc"), limit(top));
  const snapshot = await getDocs(q);
  const topScores = snapshot.docs.map(doc => doc.data());
  return topScores;
}
