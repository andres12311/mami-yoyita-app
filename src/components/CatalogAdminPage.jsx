import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Plus, Trash2, Edit3, Image, Copy, Check, Settings,
  Save, Package, Eye, EyeOff, Loader2, Link, MessageCircle
} from 'lucide-react';
import {
  saveCatalogItem,
  deleteCatalogItem,
  uploadProductImage,
  saveCatalogConfig
} from '../services/catalogService';

const CATEGORIAS = ['Desayunos', 'Tortas y Cupcakes', 'Mama 2026 💝', 'Extra'];

const emptyProduct = (currentLength) => ({
  id: 'prod-' + Date.now(),
  nombre: '',
  descripcion: '',
  ingredientes: '',
  precio: 0,
  categoria: 'Desayunos',
  imagen: '',
  orden: currentLength + 1,
  activo: true
});

const formatCOP = (precio) => new Intl.NumberFormat('es-CO').format(precio);

export default function CatalogAdminPage({ productos = [], catalogConfig = {} }) {
  const [view, setView] = useState('list');
  const [editProduct, setEditProduct] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
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

  const handleAddNew = () => {
    setEditProduct(emptyProduct(productos.length));
    setExistingImages([]);
    setImageFiles([]);
    setView('form');
  };

  const handleEdit = (product) => {
    setEditProduct({ ...product });
    setExistingImages(product.imagenes ? [...product.imagenes] : (product.imagen ? [product.imagen] : []));
    setImageFiles([]);
    setView('form');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImageFiles(prev => [...prev, ...newFiles]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!editProduct.nombre.trim()) return;
    setSaving(true);
    try {
      let newUrls = [];
      if (imageFiles.length > 0) {
        newUrls = await Promise.all(
          imageFiles.map(async (imgObj, idx) => {
            return await uploadProductImage(imgObj.file, `${editProduct.id}_${Date.now()}_${idx}`);
          })
        );
      }
      
      const finalImages = [...existingImages, ...newUrls];
      
      await saveCatalogItem({ 
        ...editProduct, 
        imagen: finalImages[0] || '',
        imagenes: finalImages 
      });
      setView('list');
      setEditProduct(null);
      setExistingImages([]);
      setImageFiles([]);
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
      await deleteCatalogItem(product);
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

  const handleGoBack = () => {
    window.location.hash = ''; // Vuelve al inicio del dashboard admin
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
  const renderProductCard = (product) => (
    <div key={product.id} style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 16px', borderRadius: '16px',
      background: product.activo === false ? '#f9f9f9' : '#fff',
      border: '1.5px solid #F3E8FF',
      opacity: product.activo === false ? 0.5 : 1,
      transition: 'all 0.2s', position: 'relative',
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
    }}>
      {product.imagen ? (
        <img src={product.imagen} alt="" style={{
          width: '60px', height: '60px', borderRadius: '12px',
          objectFit: 'cover', border: '2px solid #F3E8FF', flexShrink: 0
        }} />
      ) : (
        <div style={{
          width: '60px', height: '60px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #FDF2F8, #F3E8FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}><Image size={24} color="#D1B2F5" /></div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.nombre}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.85rem', color: '#6B7280', marginTop: '4px' }}>
          <span style={{ fontWeight: '800', color: '#FF8DA1' }}>${formatCOP(product.precio)}</span>
          {product.ingredientes && (
            <span style={{ color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
              🧾 {product.ingredientes}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <button onClick={() => handleToggleActive(product)} title={product.activo !== false ? 'Desactivar' : 'Activar'}
          style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: '#F8FAFC', color: product.activo !== false ? '#10B981' : '#9CA3AF' }}>
          {product.activo !== false ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
        <button onClick={() => handleEdit(product)} title="Editar"
          style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: '#F8FAFC', color: '#7C3AED' }}>
          <Edit3 size={18} />
        </button>
        <button onClick={() => setConfirmDelete(product.id)} title="Eliminar"
          style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: '#FEF2F2', color: '#EF4444' }}>
          <Trash2 size={18} />
        </button>
      </div>

      {confirmDelete === product.id && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '16px',
          background: 'rgba(255,255,255,0.95)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '12px', zIndex: 2,
          backdropFilter: 'blur(2px)'
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#DC2626' }}>¿Eliminar producto?</span>
          <button onClick={() => handleDelete(product)} disabled={deleting === product.id}
            style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#EF4444', color: '#fff', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center' }}>
            {deleting === product.id ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />} Sí
          </button>
          <button onClick={() => setConfirmDelete(null)}
            style={{ padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
            No
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #F3E8FF 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '35px', padding: '40px', boxShadow: '0 30px 60px -12px rgba(255, 183, 197, 0.2)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #F3E8FF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={handleGoBack}
              style={{ width: '45px', height: '45px', borderRadius: '15px', border: 'none', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#717171' }}
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#FF8DA1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={28} /> Administrar Catálogo
              </h1>
              <p style={{ margin: '5px 0 0', color: '#9CA3AF', fontSize: '0.9rem', fontWeight: '600' }}>
                Gestiona los productos que ven tus clientes
              </p>
            </div>
          </div>
        </div>

        {view === 'form' ? (
          /* ══════════════ FORM VIEW ══════════════ */
          <>
            <button onClick={() => { setView('list'); setEditProduct(null); }}
              style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Volver a la lista
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '25px', color: '#1F2937' }}>
              {editProduct?.nombre ? `Editar: ${editProduct.nombre}` : 'Nuevo Producto'}
            </h3>

            {/* Image Gallery */}
            <div style={{ marginBottom: '25px' }}>
              <label className="info-label" style={{ marginBottom: '10px', display: 'block' }}>Imágenes del producto</label>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {existingImages.map((imgUrl, idx) => (
                  <div key={`exist-${idx}`} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', border: '3px solid #F3E8FF' }}>
                    <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeExistingImage(idx)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>&times;</button>
                  </div>
                ))}
                {imageFiles.map((imgObj, idx) => (
                  <div key={`new-${idx}`} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', border: '3px solid #F3E8FF' }}>
                    <img src={imgObj.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeNewImage(idx)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>&times;</button>
                  </div>
                ))}
                
                <div style={{ width: '100px', height: '100px', borderRadius: '16px', border: '2px dashed #D1B2F5', background: '#FFFBFD', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#D1B2F5', transition: 'all 0.2s' }}
                  onClick={() => fileRef.current?.click()}
                  onMouseEnter={e => e.currentTarget.style.background = '#FDF2F8'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FFFBFD'}
                >
                  <Plus size={28} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', marginTop: '4px' }}>Añadir</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageChange} />
            </div>

            <div className="info-group" style={{ marginBottom: '20px' }}>
              <label className="info-label">Nombre del producto *</label>
              <input className="premium-input" value={editProduct?.nombre || ''} onChange={e => setEditProduct({ ...editProduct, nombre: e.target.value })} placeholder="Ej: Desayuno con waffles" />
            </div>

            <div className="info-group" style={{ marginBottom: '20px' }}>
              <label className="info-label">Descripción</label>
              <textarea className="premium-input" rows={2} style={{ resize: 'vertical', minHeight: '60px' }} value={editProduct?.descripcion || ''} onChange={e => setEditProduct({ ...editProduct, descripcion: e.target.value })} placeholder="Descripción corta del producto para los clientes" />
            </div>

            <div className="info-group" style={{ marginBottom: '20px' }}>
              <label className="info-label">🧾 Ingredientes (se auto-llenan en el pedido para cocina)</label>
              <textarea className="premium-input" rows={2} style={{ resize: 'vertical', minHeight: '60px' }} value={editProduct?.ingredientes || ''} onChange={e => setEditProduct({ ...editProduct, ingredientes: e.target.value })} placeholder="Ej: 1 lb fresas, 3 huevos, 200g harina, crema chantilly" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div className="info-group">
                <label className="info-label">Orden (posición en la lista)</label>
                <input className="premium-input" type="number" min="0" value={editProduct?.orden || ''} onChange={e => setEditProduct({ ...editProduct, orden: Number(e.target.value) })} />
              </div>
              <div className="info-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '28px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', color: '#4B5563' }}>
                  <input type="checkbox" checked={editProduct?.activo !== false} onChange={e => setEditProduct({ ...editProduct, activo: e.target.checked })} style={{ width: '22px', height: '22px', accentColor: '#FF8DA1' }} />
                  Producto activo y visible
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button className="btn-main" style={{ flex: 1, justifyContent: 'center', fontSize: '1.05rem', padding: '16px', opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving || !editProduct?.nombre?.trim()}>
                {saving ? <Loader2 size={22} className="animate-spin" /> : <Save size={22} />}
                {saving ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </>
        ) : (
          /* ══════════════ LIST VIEW ══════════════ */
          <>
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '25px', alignItems: 'center' }}>
              <button className="btn-main" onClick={handleAddNew} style={{ padding: '12px 20px' }}>
                <Plus size={18} /> Agregar Producto
              </button>
              <button className="btn-main" style={{ background: '#7C3AED', padding: '12px 20px' }} onClick={() => setShowSettings(!showSettings)}>
                <Settings size={18} /> Configuración
              </button>
              <button className="btn-main" style={{ background: '#10B981', padding: '12px 20px' }} onClick={handleCopyLink}>
                {copied ? <Check size={18} /> : <Link size={18} />}
                {copied ? '¡Link Copiado!' : 'Link Catálogo Público'}
              </button>
              <div style={{ padding: '10px 20px', background: '#F8FAFC', borderRadius: '15px', fontWeight: '700', color: '#64748B', marginLeft: 'auto', border: '1.5px solid #F1F5F9' }}>
                {productos.length} producto{productos.length !== 1 ? 's' : ''} en total
              </div>
            </div>

            {/* Settings (collapsible) */}
            {showSettings && (
              <div style={{ background: '#FFFBFD', borderRadius: '20px', border: '2px solid #F3E8FF', padding: '25px', marginBottom: '30px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#7C3AED', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={20} /> Configuración de la tienda
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="info-group">
                    <label className="info-label"><MessageCircle size={14} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px'}}/> WhatsApp para pedidos</label>
                    <input className="premium-input" value={configForm.whatsapp} onChange={e => setConfigForm({ ...configForm, whatsapp: e.target.value })} placeholder="3101234567" />
                  </div>
                  <div className="info-group">
                    <label className="info-label">Nombre de tu tienda</label>
                    <input className="premium-input" value={configForm.nombreTienda} onChange={e => setConfigForm({ ...configForm, nombreTienda: e.target.value })} placeholder="Delicias..." />
                  </div>
                </div>
                <div className="info-group" style={{ marginBottom: '20px' }}>
                  <label className="info-label">Mensaje de saludo predeterminado</label>
                  <input className="premium-input" value={configForm.mensaje} onChange={e => setConfigForm({ ...configForm, mensaje: e.target.value })} placeholder="¡Hola! Me interesa pedir:" />
                </div>
                <button className="btn-main" onClick={handleSaveConfig} disabled={configSaving}>
                  {configSaving ? <Loader2 size={18} className="animate-spin" /> : configSaved ? <Check size={18} /> : <Save size={18} />}
                  {configSaving ? 'Guardando...' : configSaved ? '¡Configuración Guardada!' : 'Guardar Configuración'}
                </button>
              </div>
            )}

            {/* Products grouped by category */}
            {productos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF', background: '#F8FAFC', borderRadius: '20px', border: '2px dashed #E2E8F0' }}>
                <Package size={60} strokeWidth={1} style={{ marginBottom: '15px', color: '#CBD5E1' }} />
                <p style={{ fontWeight: '800', fontSize: '1.2rem', margin: '0 0 5px', color: '#64748B' }}>Aún no tienes productos</p>
                <p style={{ fontSize: '1rem', margin: 0 }}>Crea tu primer producto para que los clientes puedan pedir</p>
                <button className="btn-main" onClick={handleAddNew} style={{ margin: '20px auto 0' }}>
                  <Plus size={18} /> Agregar mi primer producto
                </button>
              </div>
            ) : (
              Object.entries(groupedProducts).map(([categoria, items]) => (
                <div key={categoria} style={{ marginBottom: '35px' }}>
                  <div style={{
                    fontSize: '1.2rem', fontWeight: '800', color: '#7C3AED',
                    padding: '12px 20px', borderRadius: '15px',
                    background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)',
                    marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px'
                  }}>
                    {categoria === 'Desayunos' && '🍳'}
                    {categoria === 'Tortas y Cupcakes' && '🎂'}
                    {categoria === 'Extra' && '✨'}
                    {!['Desayunos', 'Tortas y Cupcakes', 'Extra'].includes(categoria) && '📦'}
                    {categoria}
                    <span style={{ fontSize: '0.9rem', background: 'white', color: '#7C3AED', padding: '4px 12px', borderRadius: '10px', marginLeft: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      {items.length} items
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
