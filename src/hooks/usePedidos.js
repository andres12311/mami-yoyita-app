import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { logger } from '../utils/logger';

export const usePedidos = (isAuthenticated) => {
  const [pedidos, setPedidos] = useState([]);
  const [produccionManual, setProduccionManual] = useState({});
  const [gastosDetalle, setGastosDetalle] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setPedidos([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), internalId: doc.id }));
      setPedidos(data);
      setLoading(false);
    }, (error) => {
      // Si hay error de conexión, no borrar los pedidos que ya teníamos cargados
      logger.error("Error escuchando pedidos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setProduccionManual({});
      return;
    }
    const unsubscribe = onSnapshot(doc(db, "config", "produccion"), (snapshot) => {
      if (snapshot.exists()) setProduccionManual(snapshot.data());
    }, (error) => {
      logger.error("Error escuchando producción manual:", error);
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setGastosDetalle({});
      return;
    }
    const unsubscribe = onSnapshot(doc(db, "config", "gastos"), (snapshot) => {
      if (snapshot.exists()) setGastosDetalle(snapshot.data());
    }, (error) => {
      logger.error("Error escuchando gastos detalle:", error);
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  return { pedidos, setPedidos, produccionManual, setProduccionManual, gastosDetalle, setGastosDetalle, loading };
};
