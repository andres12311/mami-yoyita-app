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

const CATEGORIAS = ['Desayunos', 'Tortas y Cupcakes', 'Extra'];

const emptyProduct = () => ({
  id: 'prod-' + Date.now(),
  nombre: '',
  descripcion: '',
  ingredientes: '',
  precio: 0,
  categoria: 'Desayunos',
  imagen: '',
  orden: 0,
  activo: true
});

const formatCOP = (precio) => new Intl.NumberFormat('es-CO').format(precio);

export default function CatalogAdminModal({ isOpen, onClose, productos = [], catalogConfig = {} }) {
  const [view, setView] = useState('list');
  const [editProduct, setEditProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [configForm, setConfigForm] = useState({
    whatsapp: catalogConfig.whatsapp || '3106305616',
    nombreTienda: catalogConfig.nombreTienda || 'Delicias de la Mami Yoyita',
    mensaje: catalogConfig.mensaje || '¡Hola! Me interesa pedir: '
  });
  const [configSaving, setConfigSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    setConfigForm({
      whatsapp: catalogConfig.whatsapp || '3106305616',
      nombreTienda: catalogConfig.nombreTienda || 'Delicias de la Mami Yoyita',
      mensaje: catalogConfig.mensaje || '¡Hola! Me interesa pedir: '
    });
  }, [catalogConfig]);

  useEffect(() => {
    if (isOpen) {
      setView('list');
      setEditProduct(null);
      setImagePreview(null);
      setImageFile(null);
      setConfirmDelete(null);
      setSelectedCategory('Todos');
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
      await saveCatalogItem({ ...editProduct, imagen: imagenUrl });
      setView('list');
      setEditProduct(null);
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error al guardar. Intenta de nuevo.');
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
      console.error('Error al eliminar:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await saveCatalogItem({ ...product, activo: !product.activo });
    } catch (err) {
      console.error('Error:', err);
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
      console.error('Error config:', err);
    } finally {
      setConfigSaving(false);
    }
  };

  // ── Filter products by category ────────────────────────
  const filteredProducts = selectedCategory === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === selectedCategory);

  const groupedProducts = {};
  CATEGORIAS.forEach(cat => {
    const items = productos.filter(p => p.categoria === cat).sort((a, b) => (a.orden || 0) - (b.orden || 0));
    if (items.length > 0) groupedProducts[cat] = items;
  });
  // Products without matching category
  const uncategorized = productos.filter(p => !CATEGORIAS.includes(p.categoria));
  if (uncategorized.length > 0) groupedProducts['Otros'] = uncategorized;

  // ── Render ─────────────────────────────────────────────
  if (!isOpen) return null;

  const renderProductCard = (product) => (
    <div key={product.id} style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 14px', borderRadius: '12px',
      background: product.activo === false ? '#f9f9f9' : '#fff',
      border: '1.5px solid #F3E8FF',
      opacity: product.activo === false ? 0.5 : 1,
      transition: 'all 0.2s', position: 'relative'
    }}>
      {product.imagen ? (
        <img src={product.imagen} alt="" style={{
          width: '48px', height: '48px', borderRadius: '10px',
          objectFit: 'cover', border: '2px solid #F3E8FF', flexShrink: 0
        }} />
      ) : (
        <div style={{
          width: '48px', height: '48px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #FDF2F8, #F3E8FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}><Image size={18} color="#D1B2F5" /></div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.nombre}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.78rem', color: '#6B7280', marginTop: '2px' }}>
          <span style={{ fontWeight: '700', color: '#FF8DA1' }}>${formatCOP(product.precio)}</span>
          {product.ingredientes && (
            <span style={{ color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
              🧾 {product.ingredientes}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
        <button onClick={() => handleToggleActive(product)} title={product.activo !== false ? 'Desactivar' : 'Activar'}
          style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: 'transparent', color: product.activo !== false ? '#10B981' : '#9CA3AF' }}>
          {product.activo !== false ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button onClick={() => handleEdit(product)} title="Editar"
          style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: 'transparent', color: '#7C3AED' }}>
          <Edit3 size={15} />
        </button>
        <button onClick={() => setConfirmDelete(product.id)} title="Eliminar"
          style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: 'transparent', color: '#EF4444' }}>
          <Trash2 size={15} />
        </button>
      </div>

      {confirmDelete === product.id && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '12px',
          background: 'rgba(255,255,255,0.97)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '10px', zIndex: 2
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#DC2626' }}>¿Eliminar?</span>
          <button onClick={() => handleDelete(product)} disabled={deleting === product.id}
            style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', background: '#FEE2E2', color: '#DC2626', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' }}>
            {deleting === product.id ? 'Eliminando...' : 'Sí'}
          </button>
          <button onClick={() => setConfirmDelete(null)}
            style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#6B7280', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' }}>
            No
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="modal-blur no-print">
      <div className="modal-lux" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '2px solid #F3E8FF' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#FF8DA1', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={22} /> Catálogo de Productos
          </div>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>

        {view === 'form' ? (
          /* ══════════════ FORM VIEW ══════════════ */
          <>
            <button onClick={() => { setView('list'); setEditProduct(null); }}
              style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← Volver
            </button>

            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>
              {editProduct?.nombre ? `Editar: ${editProduct.nombre}` : 'Nuevo Producto'}
            </h3>

            {/* Image */}
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px', borderRadius: '14px', border: '2px dashed #F3E8FF', background: '#FFFBFD', cursor: 'pointer' }}
              onClick={() => fileRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', border: '3px solid #F3E8FF' }} />
              ) : (
                <>
                  <Image size={32} color="#D1B2F5" />
                  <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Toca para subir imagen</span>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </div>

            <div className="info-group" style={{ marginBottom: '14px' }}>
              <label className="info-label">Nombre del producto *</label>
              <input className="premium-input" value={editProduct?.nombre || ''} onChange={e => setEditProduct({ ...editProduct, nombre: e.target.value })} placeholder="Ej: Desayuno con waffles" />
            </div>

            <div className="info-group" style={{ marginBottom: '14px' }}>
              <label className="info-label">Descripción</label>
              <textarea className="premium-input" rows={2} style={{ resize: 'vertical', minHeight: '50px' }} value={editProduct?.descripcion || ''} onChange={e => setEditProduct({ ...editProduct, descripcion: e.target.value })} placeholder="Descripción corta del producto" />
            </div>

            <div className="info-group" style={{ marginBottom: '14px' }}>
              <label className="info-label">🧾 Ingredientes (se auto-llenan en el pedido)</label>
              <textarea className="premium-input" rows={2} style={{ resize: 'vertical', minHeight: '50px' }} value={editProduct?.ingredientes || ''} onChange={e => setEditProduct({ ...editProduct, ingredientes: e.target.value })} placeholder="Ej: 1 lb fresas, 3 huevos, 200g harina, crema chantilly" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div className="info-group">
                <label className="info-label">Precio (COP)</label>
                <input className="premium-input" type="number" min="0" value={editProduct?.precio || ''} onChange={e => setEditProduct({ ...editProduct, precio: Number(e.target.value) })} />
              </div>
              <div className="info-group">
                <label className="info-label">Categoría</label>
                <select className="premium-input" value={editProduct?.categoria || 'Desayunos'} onChange={e => setEditProduct({ ...editProduct, categoria: e.target.value })}>
                  {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div className="info-group">
                <label className="info-label">Orden (posición)</label>
                <input className="premium-input" type="number" min="0" value={editProduct?.orden || ''} onChange={e => setEditProduct({ ...editProduct, orden: Number(e.target.value) })} />
              </div>
              <div className="info-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' }}>
                  <input type="checkbox" checked={editProduct?.activo !== false} onChange={e => setEditProduct({ ...editProduct, activo: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#FF8DA1' }} />
                  Activo
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn-main" style={{ flex: 1, justifyContent: 'center', opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving || !editProduct?.nombre?.trim()}>
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Guardando...' : 'Guardar Producto'}
              </button>
              <button className="btn-icon" style={{ width: '50px', height: '50px' }} onClick={() => { setView('list'); setEditProduct(null); }}>
                <X size={22} />
              </button>
            </div>
          </>
        ) : (
          /* ══════════════ LIST VIEW (por secciones) ══════════════ */
          <>
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
              <button className="btn-main" onClick={handleAddNew} style={{ fontSize: '0.85rem' }}>
                <Plus size={16} /> Agregar Producto
              </button>
              <button className="btn-main" style={{ background: '#7C3AED', fontSize: '0.85rem' }} onClick={() => setShowSettings(!showSettings)}>
                <Settings size={16} /> Config
              </button>
              <button className="btn-main" style={{ background: '#10B981', fontSize: '0.85rem' }} onClick={handleCopyLink}>
                {copied ? <Check size={16} /> : <Link size={16} />}
                {copied ? '¡Copiado!' : 'Link Catálogo'}
              </button>
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginLeft: 'auto' }}>
                {productos.length} producto{productos.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Settings (collapsible) */}
            {showSettings && (
              <div style={{ background: '#FFFBFD', borderRadius: '14px', border: '1.5px solid #F3E8FF', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#7C3AED', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Settings size={14} /> Configuración
                </div>
                <div className="info-group" style={{ marginBottom: '10px' }}>
                  <label className="info-label"><MessageCircle size={12} /> WhatsApp</label>
                  <input className="premium-input" value={configForm.whatsapp} onChange={e => setConfigForm({ ...configForm, whatsapp: e.target.value })} placeholder="3101234567" />
                </div>
                <div className="info-group" style={{ marginBottom: '10px' }}>
                  <label className="info-label">Mensaje de saludo</label>
                  <input className="premium-input" value={configForm.mensaje} onChange={e => setConfigForm({ ...configForm, mensaje: e.target.value })} placeholder="¡Hola! Me interesa pedir:" />
                </div>
                <button className="btn-main" style={{ fontSize: '0.82rem' }} onClick={handleSaveConfig} disabled={configSaving}>
                  {configSaving ? <Loader2 size={14} className="animate-spin" /> : configSaved ? <Check size={14} /> : <Save size={14} />}
                  {configSaving ? 'Guardando...' : configSaved ? '¡Guardado!' : 'Guardar Config'}
                </button>
              </div>
            )}

            {/* Products grouped by category */}
            {productos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                <Package size={40} strokeWidth={1.2} style={{ marginBottom: '10px', color: '#D1D5DB' }} />
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>Sin productos aún</p>
                <p style={{ fontSize: '0.85rem' }}>Agrega tu primer producto al catálogo</p>
              </div>
            ) : (
              Object.entries(groupedProducts).map(([categoria, items]) => (
                <div key={categoria} style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontSize: '0.95rem', fontWeight: '800', color: '#7C3AED',
                    padding: '8px 14px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)',
                    marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    {categoria === 'Desayunos' && '🍳'}
                    {categoria === 'Tortas y Cupcakes' && '🎂'}
                    {categoria === 'Extra' && '✨'}
                    {!['Desayunos', 'Tortas y Cupcakes', 'Extra'].includes(categoria) && '📦'}
                    {categoria}
                    <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: '500', marginLeft: 'auto' }}>
                      {items.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map(renderProductCard)}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
