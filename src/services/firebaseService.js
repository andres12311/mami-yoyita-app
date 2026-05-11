import { doc, setDoc, deleteDoc, writeBatch, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { logger } from '../utils/logger';

export const syncToCloud = async (data) => {
  try {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    data.forEach(p => {
      const docRef = doc(db, "pedidos", p.internalId);
      batch.set(docRef, { ...p, lastModifiedAt: now });
    });
    await batch.commit();
    logger.info("Sincronizado con la nube");
  } catch (err) {
    logger.error("Error sincronizando:", err);
    throw err;
  }
};

export const savePedidoCloud = async (pedido) => {
  try {
    const now = new Date().toISOString();
    await setDoc(doc(db, "pedidos", pedido.internalId), { 
      ...pedido, 
      lastModifiedAt: now 
    });
  } catch (err) {
    logger.error("Error al guardar pedido:", err);
    throw err;
  }
};

export const deletePedidoCloud = async (id) => {
  try {
    await deleteDoc(doc(db, "pedidos", id));
  } catch (err) {
    logger.error("Error al eliminar pedido:", err);
    throw err;
  }
};

export const saveConfigCloud = async (collectionName, newData) => {
  try {
    const now = new Date().toISOString();
    await setDoc(doc(db, "config", collectionName), { ...newData, lastModifiedAt: now });
  } catch (err) {
    logger.error(`Error guardando ${collectionName}:`, err);
    throw err;
  }
};
