import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { syncToCloud } from '../services/firebaseService';
import { logger } from '../utils/logger';

export const usePedidos = (isAuthenticated) => {
  const [pedidos, setPedidos] = useState([]);
  const [produccionManual, setProduccionManual] = useState({});
  const [gastosDetalle, setGastosDetalle] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), internalId: doc.id }));
      if (data.length > 0) {
        setPedidos(data);
      } else {
        // Intentar restaurar desde localStorage como fallback
        const saved = localStorage.getItem('pedidos_anual_v2');
        if (saved) {
          try {
            const localData = JSON.parse(saved);
            setPedidos(localData);
            syncToCloud(localData);
          } catch (e) {
            logger.error("Error parseando datos locales:", e);
          }
        }
        // Si no hay datos locales, empezar con lista vacía
        // Los pedidos se crean con el botón "Nuevo Pedido"
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribe = onSnapshot(doc(db, "config", "produccion"), (snapshot) => {
      if (snapshot.exists()) setProduccionManual(snapshot.data());
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribe = onSnapshot(doc(db, "config", "gastos"), (snapshot) => {
      if (snapshot.exists()) setGastosDetalle(snapshot.data());
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  return { pedidos, setPedidos, produccionManual, setProduccionManual, gastosDetalle, setGastosDetalle, loading };
};
