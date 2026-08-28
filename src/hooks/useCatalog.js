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
    let fallbackUnsubscribe = null;
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProductos(data);
      setLoading(false);
    }, (error) => {
      console.warn("Falla en orden del catálogo, usando fallback sin orden:", error);
      // Si falla el orderBy (sin índice), intentar sin orden
      fallbackUnsubscribe = onSnapshot(collection(db, "catalogo"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setProductos(data);
        setLoading(false);
      }, (fallbackError) => {
        console.error("Error crítico cargando catálogo:", fallbackError);
        setLoading(false);
      });
    });

    return () => {
      unsubscribe();
      if (fallbackUnsubscribe) {
        fallbackUnsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "config", "catalogo"), (snapshot) => {
      if (snapshot.exists()) {
        setCatalogConfig(prev => ({ ...prev, ...snapshot.data() }));
      }
    }, (error) => {
      console.error("Error cargando config de catálogo:", error);
    });
    return () => unsubscribe();
  }, []);

  return { productos, catalogConfig, loading };
};
