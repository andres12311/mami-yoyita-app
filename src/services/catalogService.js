import { doc, setDoc, deleteDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { logger } from '../utils/logger';

// ═══════════════════════════════════════════
// UPLOAD DE IMÁGENES
// ═══════════════════════════════════════════

export const uploadProductImage = async (file, productId) => {
  try {
    // Comprimir si es muy grande (max 800px de ancho)
    const compressedFile = await compressImage(file, 800, 0.8);
    
    try {
      // Intentar subir a Firebase Storage
      const storageRef = ref(storage, `catalogo/${productId}_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (storageErr) {
      // Si Storage no está habilitado, convertir a base64 como fallback
      logger.warn("Storage no disponible, usando base64 como fallback");
      return await fileToBase64(compressedFile);
    }
  } catch (err) {
    logger.error("Error subiendo imagen:", err);
    throw err;
  }
};

const fileToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const compressImage = (file, maxWidth, quality) => {
  return new Promise((resolve) => {
    // Si no es imagen, retornar tal cual
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(blob),
        'image/jpeg',
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// ═══════════════════════════════════════════
// CRUD PRODUCTOS
// ═══════════════════════════════════════════

export const saveCatalogItem = async (item) => {
  try {
    const now = new Date().toISOString();
    const docRef = doc(db, "catalogo", item.id);
    await setDoc(docRef, {
      ...item,
      lastModifiedAt: now
    });
  } catch (err) {
    logger.error("Error guardando producto:", err);
    throw err;
  }
};

export const deleteCatalogItem = async (id, imageUrl) => {
  try {
    // Intentar eliminar imagen de Storage
    if (imageUrl && imageUrl.includes('firebase')) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (e) {
        // Si falla la eliminación de imagen, no bloqueamos
        logger.warn("No se pudo eliminar imagen:", e);
      }
    }
    await deleteDoc(doc(db, "catalogo", id));
  } catch (err) {
    logger.error("Error eliminando producto:", err);
    throw err;
  }
};

// ═══════════════════════════════════════════
// CONFIG DEL CATÁLOGO (WhatsApp, nombre, etc.)
// ═══════════════════════════════════════════

export const saveCatalogConfig = async (config) => {
  try {
    await setDoc(doc(db, "config", "catalogo"), {
      ...config,
      lastModifiedAt: new Date().toISOString()
    });
  } catch (err) {
    logger.error("Error guardando config catálogo:", err);
    throw err;
  }
};
