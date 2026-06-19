const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, updateDoc } = require('firebase/firestore');

const app = initializeApp({
  apiKey: "AIzaSyDQUNGaXrEUhNzBkFryTCgB_cxlrg0GLZY",
  authDomain: "mami-yoyita.firebaseapp.com",
  projectId: "mami-yoyita",
  storageBucket: "mami-yoyita.firebasestorage.app",
  messagingSenderId: "929594688488",
  appId: "1:929594688488:web:9253175d65b843a4a9da5d",
  measurementId: "G-9Q0GG8CF4G"
});

const db = getFirestore(app);

async function fix() {
  const ref = doc(db, 'catalogo', 'prod-1781825873995');
  const d = await getDoc(ref);
  const data = d.data();
  if (data && data.imagenes) {
    const valid = [data.imagenes[0]]; // The first image is the original one
    await updateDoc(ref, { imagenes: valid });
    console.log("FIXED");
  }
  process.exit(0);
}

fix().catch(console.error);
