import { doc, setDoc, deleteDoc, writeBatch, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { logger } from '../utils/logger';

// ═══════════════════════════════════════════
// SANITIZACIÓN: limpiar datos antes de guardar
// ═══════════════════════════════════════════

const sanitizeString = (value, maxLength = 200) => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, '')     // Eliminar tags HTML (anti-XSS)
    .replace(/javascript:/gi, '') // Eliminar javascript: URIs
    .replace(/on\w+\s*=/gi, '')   // Eliminar event handlers
    .substring(0, maxLength)
    .trim();
};

const sanitizeNumber = (value, min = 0, max = 50000000) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return Math.max(min, Math.min(max, num));
};

const sanitizePedido = (pedido) => {
  return {
    ...pedido,
    'nombre cliente': sanitizeString(pedido['nombre cliente'], 150),
    Pedido: sanitizeString(pedido.Pedido, 200),
    Direccion: sanitizeString(pedido.Direccion, 300),
    Telefono: sanitizeString(pedido.Telefono, 25).replace(/[^0-9+() -]/g, ''),
    telefonoReceptor: sanitizeString(pedido.telefonoReceptor || '', 25).replace(/[^0-9+() -]/g, ''),
    'Hora entrega': sanitizeString(pedido['Hora entrega'], 30),
    Ingredientes: sanitizeString(pedido.Ingredientes, 1000),
    precioDesayuno: sanitizeNumber(pedido.precioDesayuno, 0, 50000000),
    precioDomicilio: sanitizeNumber(pedido.precioDomicilio, 0, 5000000),
    status: ['pendiente', 'proceso', 'listo'].includes(pedido.status) ? pedido.status : 'pendiente',
    movil: sanitizeString(pedido.movil || '', 10),
    ingredientesProduccion: sanitizeString(pedido.ingredientesProduccion || '', 500),
  };
};

// ═══════════════════════════════════════════
// RATE LIMITING: evitar escrituras excesivas
// ═══════════════════════════════════════════

const writeTimestamps = [];
const MAX_WRITES_PER_MINUTE = 180;

const checkRateLimit = () => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Limpiar timestamps viejos
  while (writeTimestamps.length > 0 && writeTimestamps[0] < oneMinuteAgo) {
    writeTimestamps.shift();
  }
  
  if (writeTimestamps.length >= MAX_WRITES_PER_MINUTE) {
    throw new Error('⚠️ Demasiadas operaciones. Espera un momento.');
  }
  
  writeTimestamps.push(now);
};

// ═══════════════════════════════════════════
// OPERACIONES DE BASE DE DATOS
// ═══════════════════════════════════════════

export const syncToCloud = async (data) => {
  try {
    checkRateLimit();
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    data.forEach(p => {
      const sanitized = sanitizePedido(p);
      const docRef = doc(db, "pedidos", p.internalId);
      batch.set(docRef, { ...sanitized, lastModifiedAt: now });
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
    checkRateLimit();
    const sanitized = sanitizePedido(pedido);
    const now = new Date().toISOString();
    await setDoc(doc(db, "pedidos", pedido.internalId), { 
      ...sanitized, 
      lastModifiedAt: now 
    });
  } catch (err) {
    logger.error("Error al guardar pedido:", err);
    throw err;
  }
};

export const deletePedidoCloud = async (id) => {
  try {
    checkRateLimit();
    // Validar que el ID no contenga paths maliciosos
    if (typeof id !== 'string' || id.includes('/') || id.includes('..') || id.length > 100) {
      throw new Error('ID de pedido inválido');
    }
    await deleteDoc(doc(db, "pedidos", id));
  } catch (err) {
    logger.error("Error al eliminar pedido:", err);
    throw err;
  }
};

export const saveConfigCloud = async (collectionName, newData) => {
  try {
    checkRateLimit();
    // Validar nombre de colección (solo permitir nombres conocidos)
    const allowedCollections = ['produccion', 'gastos'];
    if (!allowedCollections.includes(collectionName)) {
      throw new Error(`Colección no permitida: ${collectionName}`);
    }
    const now = new Date().toISOString();
    await setDoc(doc(db, "config", collectionName), { ...newData, lastModifiedAt: now });
  } catch (err) {
    logger.error(`Error guardando ${collectionName}:`, err);
    throw err;
  }
};
