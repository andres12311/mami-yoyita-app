import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const useCatalog = () => {
  const [productos, setProductos] = useState([]);
  const [catalogConfig, setCatalogConfig] = useState({
    whatsapp: '3106305616',
    nombreTienda: 'Delicias de la Mami Yoyita',
    mensaje: '¡Hola! Me interesa pedir: '
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "catalogo"), orderBy("orden", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProductos(data);
      setLoading(false);
    }, (error) => {
      // Si falla el orderBy (sin índice), intentar sin orden
      const fallback = onSnapshot(collection(db, "catalogo"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setProductos(data);
        setLoading(false);
      });
      return () => fallback();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "config", "catalogo"), (snapshot) => {
      if (snapshot.exists()) {
        setCatalogConfig(prev => ({ ...prev, ...snapshot.data() }));
      }
    });
    return () => unsubscribe();
  }, []);

  return { productos, catalogConfig, loading };
};
