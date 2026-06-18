import React, { useState, useRef, useEffect } from 'react';
import {
  X, Plus, Trash2, Edit3, Image, Copy, Check, Settings,
  Save, Package, Eye, EyeOff, Loader2, Link, MessageCircle
} from 'lucide-react';
import {
  saveCatalogItem,
  deleteCatalogItem,
  uploadProductImage,
  saveCatalogConfig
} from '../../services/catalogService';

const CATEGORIAS = ['Desayunos', 'Tortas', 'Saludables', 'Especiales'];

const emptyProduct = () => ({
  id: 'prod-' + Date.now(),
  nombre: '',
  descripcion: '',
  precio: 0,
  categoria: 'Desayunos',
  imagen: '',
  orden: 0,
  activo: true
});

const formatCOP = (precio) => new Intl.NumberFormat('es-CO').format(precio);

export default function CatalogAdminModal({ isOpen, onClose, productos = [], catalogConfig = {} }) {
  // ── State ──────────────────────────────────────────────
  const [view, setView] = useState('list'); // 'list' | 'form' | 'settings'
  const [editProduct, setEditProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [copied, setCopied] = useState(false);
  const [configForm, setConfigForm] = useState({
    whatsapp: catalogConfig.whatsapp || '',
    nombreTienda: catalogConfig.nombreTienda || 'Delicias de la Mami Yoyita',
    mensaje: catalogConfig.mensaje || ''
  });
  const [configSaving, setConfigSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const fileRef = useRef(null);

  // Sync config when prop changes
  useEffect(() => {
    setConfigForm({
      whatsapp: catalogConfig.whatsapp || '',
      nombreTienda: catalogConfig.nombreTienda || 'Delicias de la Mami Yoyita',
      mensaje: catalogConfig.mensaje || ''
    });
  }, [catalogConfig]);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('list');
      setEditProduct(null);
      setImagePreview(null);
      setImageFile(null);
      setConfirmDelete(null);
    }
  }, [isOpen]);

  // ── Handlers ───────────────────────────────────────────
  const handleAddNew = () => {
    setEditProduct(emptyProduct());
    setImagePreview(null);
    setImageFile(null);
    setView('form');
  };

  const handleEdit = (product) => {
    setEditProduct({ ...product });
    setImagePreview(product.imagen || null);
    setImageFile(null);
    setView('form');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editProduct.nombre.trim()) return;
    setSaving(true);
    try {
      let imagenUrl = editProduct.imagen;
      if (imageFile) {
        imagenUrl = await uploadProductImage(imageFile, editProduct.id);
      }
      const productToSave = { ...editProduct, imagen: imagenUrl };
      await saveCatalogItem(productToSave);
      setView('list');
      setEditProduct(null);
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      console.error('Error al guardar producto:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    setDeleting(product.id);
    try {
      await deleteCatalogItem(product.id);
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await saveCatalogItem({ ...product, activo: !product.activo });
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const handleCopyLink = () => {
    const link = window.location.origin + window.location.pathname + '#/catalogo';
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveConfig = async () => {
    setConfigSaving(true);
    try {
      await saveCatalogConfig(configForm);
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2000);
    } catch (err) {
      console.error('Error al guardar configuración:', err);
    } finally {
      setConfigSaving(false);
    }
  };

  // ── Styles ─────────────────────────────────────────────
  const styles = {
    header: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '20px', paddingBottom: '16px',
      borderBottom: '2px solid #F3E8FF'
    },
    title: {
      fontSize: '1.35rem', fontWeight: '700', color: '#FF8DA1',
      display: 'flex', alignItems: 'center', gap: '10px'
    },
    closeBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: '#999', padding: '4px', borderRadius: '8px',
      transition: 'all 0.2s'
    },
    toolbar: {
      display: 'flex', gap: '8px', flexWrap: 'wrap',
      marginBottom: '18px', alignItems: 'center'
    },
    btnPrimary: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '8px 16px', borderRadius: '10px', border: 'none',
      background: 'linear-gradient(135deg, #FF8DA1, #F472B6)',
      color: '#fff', fontWeight: '600', fontSize: '0.85rem',
      cursor: 'pointer', transition: 'all 0.2s',
      boxShadow: '0 2px 8px rgba(255,141,161,0.3)'
    },
    btnSecondary: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '8px 16px', borderRadius: '10px',
      border: '1.5px solid #F3E8FF', background: '#FEFCFF',
      color: '#7C3AED', fontWeight: '600', fontSize: '0.85rem',
      cursor: 'pointer', transition: 'all 0.2s'
    },
    btnDanger: {
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '6px 12px', borderRadius: '8px', border: 'none',
      background: '#FEE2E2', color: '#DC2626', fontWeight: '600',
      fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
    },
    btnGhost: {
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '6px 12px', borderRadius: '8px', border: 'none',
      background: 'transparent', color: '#FF8DA1', fontWeight: '600',
      fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
    },
    productCard: {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 14px', borderRadius: '14px',
      background: '#FFFBFD', border: '1.5px solid #F3E8FF',
      marginBottom: '10px', transition: 'all 0.2s',
      position: 'relative'
    },
    thumbnail: {
      width: '52px', height: '52px', borderRadius: '10px',
      objectFit: 'cover', border: '2px solid #F3E8FF',
      background: '#FDF2F8', flexShrink: 0
    },
    thumbPlaceholder: {
      width: '52px', height: '52px', borderRadius: '10px',
      background: 'linear-gradient(135deg, #FDF2F8, #F3E8FF)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    },
    productInfo: {
      flex: 1, minWidth: 0
    },
    productName: {
      fontWeight: '700', fontSize: '0.95rem', color: '#1F2937',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
    },
    productMeta: {
      display: 'flex', gap: '10px', alignItems: 'center',
      fontSize: '0.8rem', color: '#6B7280', marginTop: '2px'
    },
    badge: {
      padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem',
      fontWeight: '600', background: '#F3E8FF', color: '#7C3AED'
    },
    price: {
      fontWeight: '700', color: '#FF8DA1', fontSize: '0.9rem'
    },
    actions: {
      display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0
    },
    iconBtn: {
      width: '34px', height: '34px', borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
      background: 'transparent'
    },
    formGroup: {
      marginBottom: '16px'
    },
    formRow: {
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    },
    imageUpload: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '10px', padding: '20px', borderRadius: '14px',
      border: '2px dashed #F3E8FF', background: '#FFFBFD',
      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
    },
    imagePreview: {
      width: '120px', height: '120px', borderRadius: '12px',
      objectFit: 'cover', border: '3px solid #F3E8FF'
    },
    section: {
      background: '#FFFBFD', borderRadius: '14px',
      border: '1.5px solid #F3E8FF', padding: '18px',
      marginBottom: '16px'
    },
    sectionTitle: {
      fontSize: '0.95rem', fontWeight: '700', color: '#7C3AED',
      display: 'flex', alignItems: 'center', gap: '8px',
      marginBottom: '14px'
    },
    emptyState: {
      textAlign: 'center', padding: '40px 20px', color: '#9CA3AF'
    },
    confirmOverlay: {
      position: 'absolute', inset: 0, borderRadius: '14px',
      background: 'rgba(255,255,255,0.95)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', gap: '10px',
      zIndex: 2
    },
    inactiveOverlay: {
      opacity: 0.5
    }
  };

  // ── Render helpers ─────────────────────────────────────
  const renderSettingsSection = () => (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>
        <Settings size={16} />
        Configuración del Catálogo
      </div>
      <div className="info-group" style={{ marginBottom: '12px' }}>
        <label className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MessageCircle size={14} /> WhatsApp
        </label>
        <input
          className="premium-input"
          type="text"
          placeholder="Ej: 573001234567"
          value={configForm.whatsapp}
          onChange={e => setConfigForm({ ...configForm, whatsapp: e.target.value })}
        />
      </div>
      <div className="info-group" style={{ marginBottom: '12px' }}>
        <label className="info-label">Mensaje de saludo</label>
        <textarea
          className="premium-input"
          rows={2}
          placeholder="Ej: ¡Hola! Me gustaría hacer un pedido..."
          value={configForm.mensaje}
          onChange={e => setConfigForm({ ...configForm, mensaje: e.target.value })}
          style={{ resize: 'vertical', minHeight: '48px' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          style={styles.btnPrimary}
          onClick={handleSaveConfig}
          disabled={configSaving}
        >
          {configSaving ? <Loader2 size={14} className="spin" /> : configSaved ? <Check size={14} /> : <Save size={14} />}
          {configSaving ? 'Guardando...' : configSaved ? '¡Guardado!' : 'Guardar Config'}
        </button>
        <button style={styles.btnSecondary} onClick={handleCopyLink}>
          {copied ? <Check size={14} /> : <Link size={14} />}
          {copied ? '¡Copiado!' : 'Copiar enlace catálogo'}
        </button>
      </div>
    </div>
  );

  const renderProductList = () => (
    <>
      {renderSettingsSection()}

      <div style={styles.toolbar}>
        <button style={styles.btnPrimary} onClick={handleAddNew}>
          <Plus size={16} /> Agregar Producto
        </button>
        <span style={{ fontSize: '0.82rem', color: '#9CA3AF', marginLeft: 'auto' }}>
          {productos.length} producto{productos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {productos.length === 0 ? (
        <div style={styles.emptyState}>
          <Package size={40} strokeWidth={1.2} style={{ marginBottom: '10px', color: '#D1D5DB' }} />
          <p style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '4px' }}>Sin productos aún</p>
          <p style={{ fontSize: '0.85rem' }}>Agrega tu primer producto al catálogo</p>
        </div>
      ) : (
        [...productos]
          .sort((a, b) => (a.orden || 0) - (b.orden || 0))
          .map(product => (
            <div
              key={product.id}
              style={{
                ...styles.productCard,
                ...(product.activo === false ? styles.inactiveOverlay : {})
              }}
            >
              {/* Thumbnail */}
              {product.imagen ? (
                <img src={product.imagen} alt={product.nombre} style={styles.thumbnail} />
              ) : (
                <div style={styles.thumbPlaceholder}>
                  <Image size={20} color="#D1B2F5" />
                </div>
              )}

              {/* Info */}
              <div style={styles.productInfo}>
                <div style={styles.productName}>{product.nombre}</div>
                <div style={styles.productMeta}>
                  <span style={styles.price}>${formatCOP(product.precio)}</span>
                  <span style={styles.badge}>{product.categoria}</span>
                  {product.orden > 0 && (
                    <span style={{ fontSize: '0.72rem', color: '#B0B0B0' }}>#{product.orden}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={styles.actions}>
                <button
                  style={{ ...styles.iconBtn, color: product.activo !== false ? '#10B981' : '#9CA3AF' }}
                  onClick={() => handleToggleActive(product)}
                  title={product.activo !== false ? 'Desactivar' : 'Activar'}
                >
                  {product.activo !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  style={{ ...styles.iconBtn, color: '#7C3AED' }}
                  onClick={() => handleEdit(product)}
                  title="Editar"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  style={{ ...styles.iconBtn, color: '#EF4444' }}
                  onClick={() => setConfirmDelete(product.id)}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Delete confirmation overlay */}
              {confirmDelete === product.id && (
                <div style={styles.confirmOverlay}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#DC2626' }}>
                    ¿Eliminar este producto?
                  </span>
                  <button
                    style={styles.btnDanger}
                    onClick={() => handleDelete(product)}
                    disabled={deleting === product.id}
                  >
                    {deleting === product.id ? <Loader2 size={13} className="spin" /> : <Trash2 size={13} />}
                    {deleting === product.id ? 'Eliminando...' : 'Sí, eliminar'}
                  </button>
                  <button
                    style={{ ...styles.btnGhost, color: '#6B7280' }}
                    onClick={() => setConfirmDelete(null)}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))
      )}
    </>
  );

  const renderForm = () => (
    <>
      <button
        style={{ ...styles.btnGhost, marginBottom: '14px', color: '#7C3AED' }}
        onClick={() => { setView('list'); setEditProduct(null); }}
      >
        ← Volver a la lista
      </button>

      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1F2937', marginBottom: '18px' }}>
        {editProduct?.nombre ? `Editar: ${editProduct.nombre}` : 'Nuevo Producto'}
      </h3>

      {/* Image upload */}
      <div style={{ marginBottom: '18px' }}>
        <div
          style={styles.imageUpload}
          onClick={() => fileRef.current?.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
          ) : (
            <>
              <Image size={32} color="#D1B2F5" />
              <span style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: '500' }}>
                Toca para subir imagen
              </span>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Nombre */}
      <div className="info-group" style={styles.formGroup}>
        <label className="info-label">Nombre del producto *</label>
        <input
          className="premium-input"
          type="text"
          placeholder="Ej: Torta de chocolate"
          value={editProduct?.nombre || ''}
          onChange={e => setEditProduct({ ...editProduct, nombre: e.target.value })}
        />
      </div>

      {/* Descripción */}
      <div className="info-group" style={styles.formGroup}>
        <label className="info-label">Descripción</label>
        <textarea
          className="premium-input"
          rows={3}
          placeholder="Descripción del producto..."
          value={editProduct?.descripcion || ''}
          onChange={e => setEditProduct({ ...editProduct, descripcion: e.target.value })}
          style={{ resize: 'vertical', minHeight: '60px' }}
        />
      </div>

      {/* Precio + Categoría */}
      <div style={styles.formRow}>
        <div className="info-group" style={styles.formGroup}>
          <label className="info-label">Precio (COP)</label>
          <input
            className="premium-input"
            type="number"
            min="0"
            placeholder="0"
            value={editProduct?.precio || ''}
            onChange={e => setEditProduct({ ...editProduct, precio: Number(e.target.value) })}
          />
        </div>
        <div className="info-group" style={styles.formGroup}>
          <label className="info-label">Categoría</label>
          <select
            className="premium-input"
            value={editProduct?.categoria || 'Desayunos'}
            onChange={e => setEditProduct({ ...editProduct, categoria: e.target.value })}
          >
            {CATEGORIAS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orden + Activo */}
      <div style={styles.formRow}>
        <div className="info-group" style={styles.formGroup}>
          <label className="info-label">Orden</label>
          <input
            className="premium-input"
            type="number"
            min="0"
            placeholder="0"
            value={editProduct?.orden || ''}
            onChange={e => setEditProduct({ ...editProduct, orden: Number(e.target.value) })}
          />
        </div>
        <div className="info-group" style={{ ...styles.formGroup, display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem', color: '#374151'
          }}>
            <input
              type="checkbox"
              checked={editProduct?.activo !== false}
              onChange={e => setEditProduct({ ...editProduct, activo: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#FF8DA1' }}
            />
            Producto activo
          </label>
        </div>
      </div>

      {/* Save button */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <button
          className="btn-main"
          style={{
            ...styles.btnPrimary,
            padding: '12px 28px', fontSize: '0.95rem',
            opacity: saving || !editProduct?.nombre?.trim() ? 0.6 : 1,
            pointerEvents: saving ? 'none' : 'auto'
          }}
          onClick={handleSave}
          disabled={saving || !editProduct?.nombre?.trim()}
        >
          {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          {saving ? 'Guardando...' : 'Guardar Producto'}
        </button>
        <button
          style={{ ...styles.btnSecondary, padding: '12px 20px' }}
          onClick={() => { setView('list'); setEditProduct(null); }}
        >
          Cancelar
        </button>
      </div>
    </>
  );

  // ── Main render ────────────────────────────────────────
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-lux"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.title}>
            <Package size={22} />
            Administrar Catálogo
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        {view === 'form' ? renderForm() : renderProductList()}
      </div>
    </div>
  );
}
