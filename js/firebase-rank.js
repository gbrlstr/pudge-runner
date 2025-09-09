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
  const q = query(rankCollection, orderBy("score", "desc"), limit(100)); // Busca 100 registros
  const snapshot = await getDocs(q);
  const allScores = snapshot.docs.map(doc => doc.data());
  
  // Filtrar para manter apenas a melhor pontuação de cada nome
  const uniqueScores = [];
  const seenNames = new Set();
  
  for (const score of allScores) {
    const normalizedName = score.name.toLowerCase().trim();
    if (!seenNames.has(normalizedName)) {
      seenNames.add(normalizedName);
      uniqueScores.push(score);
      
      if (uniqueScores.length >= top) {
        break;
      }
    }
  }
  
  return uniqueScores;
}
