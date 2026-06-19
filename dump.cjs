const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');

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
getDocs(collection(db, 'catalogo')).then(snapshot => {
  const data = [];
  snapshot.forEach(doc => data.push({id: doc.id, ...doc.data()}));
  fs.writeFileSync('productos_dump.json', JSON.stringify(data, null, 2));
  console.log("DUMP SUCCESS");
  process.exit(0);
}).catch(console.error);
