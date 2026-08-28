import React from 'react';
import { X, Save } from 'lucide-react';

const EditOrderModal = ({ editingPedido, setEditingPedido, onSave, catalogProducts = [] }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  if (!editingPedido) return null;

  const handleChange = (field, value) => {
    setEditingPedido({ ...editingPedido, [field]: value });
  };

  const handleNumericChange = (field, value) => {
    if (value === '') {
      handleChange(field, '');
      return;
    }
    const num = parseFloat(value);
    handleChange(field, isNaN(num) || num < 0 ? 0 : num);
  };

  const handleSave = async () => {
    // Validación mínima antes de guardar
    if (!editingPedido.Pedido || !editingPedido.Pedido.trim()) {
      alert('El campo "Pedido / Producto" es obligatorio.');
      return;
    }
    if (!editingPedido['nombre cliente'] || !editingPedido['nombre cliente'].trim()) {
      alert('El campo "Nombre del Cliente" es obligatorio.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCatalogSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    
    const product = catalogProducts.find(p => p.id === selectedId);
    if (product) {
      setEditingPedido({
        ...editingPedido,
        Pedido: product.nombre,
        ingredientesProduccion: product.ingredientes || '',
        precioDesayuno: product.precio || 0
      });
    }
  };

  return (
    <div className="modal-blur no-print">
      <div className="modal-lux">
        <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
          <h2>{editingPedido.isNew ? 'Nuevo Pedido' : 'Editar Pedido'}</h2>
          <button className="btn-icon" onClick={() => setEditingPedido(null)}><X /></button>
        </div>

        <div className="modal-body" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div className="info-group">
            <label className="info-label">Nombre del Cliente *</label>
            <input 
              className="premium-input" 
              value={editingPedido['nombre cliente'] || ''} 
              onChange={e => handleChange('nombre cliente', e.target.value)} 
              maxLength={100}
              placeholder="Nombre completo del cliente"
            />
          </div>

          {/* Product Selection from Catalog */}
          {catalogProducts.length > 0 && (
            <div className="info-group" style={{ background: '#FFFBFD', padding: '12px', borderRadius: '12px', border: '1.5px dashed #F3E8FF' }}>
              <label className="info-label" style={{ color: '#EC4899' }}>🛍️ Seleccionar producto del catálogo (Auto-completar)</label>
              <select 
                className="premium-input"
                onChange={handleCatalogSelect}
                defaultValue=""
                style={{ cursor: 'pointer' }}
              >
                <option value="" disabled>-- Elige un producto para auto-completar --</option>
                {catalogProducts.filter(p => p.activo !== false).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - ${new Intl.NumberFormat('es-CO').format(p.precio)}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <div className="info-group">
              <label className="info-label">Teléfono Cliente</label>
              <input 
                className="premium-input" 
                type="tel"
                inputMode="numeric"
                value={editingPedido.Telefono || ''} 
                onChange={e => handleChange('Telefono', e.target.value.replace(/[^0-9+() -]/g, ''))} 
                maxLength={20}
                placeholder="Celular del cliente"
              />
            </div>
            <div className="info-group">
              <label className="info-label">Teléfono Receptor</label>
              <input 
                className="premium-input" 
                type="tel"
                inputMode="numeric"
                value={editingPedido.telefonoReceptor || ''} 
                onChange={e => handleChange('telefonoReceptor', e.target.value.replace(/[^0-9+() -]/g, ''))} 
                maxLength={20}
                placeholder="Celular de quien recibe"
              />
            </div>
          </div>

          <div className="info-group">
            <label className="info-label">Hora Entrega</label>
            <input 
              className="premium-input" 
              type="text"
              value={editingPedido['Hora entrega'] || ''} 
              onChange={e => handleChange('Hora entrega', e.target.value)} 
              placeholder="Ej: 2:00 pm o 8:30 am"
            />
          </div>

          <div className="info-group">
            <label className="info-label">Dirección</label>
            <input 
              className="premium-input" 
              value={editingPedido.Direccion || ''} 
              onChange={e => handleChange('Direccion', e.target.value)} 
              maxLength={200}
              placeholder="Dirección de entrega"
            />
          </div>

          <div className="info-group">
            <label className="info-label">Pedido / Producto *</label>
            <input 
              className="premium-input" 
              value={editingPedido.Pedido || ''} 
              onChange={e => handleChange('Pedido', e.target.value)} 
              maxLength={150}
              placeholder="Nombre del producto principal"
            />
          </div>

          <div className="info-group">
            <label className="info-label">Ingredientes Extras (Para Producción)</label>
            <input 
              className="premium-input" 
              value={editingPedido.ingredientesProduccion || ''} 
              onChange={e => handleChange('ingredientesProduccion', e.target.value)} 
              maxLength={300}
              placeholder="Ej: 1 lb fresas, 2 duraznos (Separados por coma)"
            />
          </div>

          <div className="info-group">
            <label className="info-label">Detalles / Mensajes (No va a producción)</label>
            <textarea 
              className="premium-input" 
              style={{height: '100px', resize: 'none'}} 
              value={editingPedido.Ingredientes || ''} 
              onChange={e => handleChange('Ingredientes', e.target.value)} 
              maxLength={500}
              placeholder="Dedicatorias, colores, o mensajes para el pedido"
            />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <div className="info-group">
              <label className="info-label">Precio Desayuno ($)</label>
              <input 
                type="number"
                min="0"
                max="10000000"
                step="1000"
                className="premium-input" 
                  value={editingPedido.precioDesayuno ?? ''} 
                  onChange={e => handleNumericChange('precioDesayuno', e.target.value)} 
                />
              </div>
              <div className="info-group">
                <label className="info-label">Precio Domicilio ($)</label>
                <input 
                  type="number"
                  min="0"
                  max="1000000"
                  step="500"
                  className="premium-input" 
                  value={editingPedido.precioDomicilio ?? ''} 
                  onChange={e => handleNumericChange('precioDomicilio', e.target.value)} 
                />
              </div>
            </div>
          </div>
  
          <div className="modal-footer" style={{marginTop: '30px', display: 'flex', gap: '15px'}}>
            <button className="btn-main" style={{flex: 1, justifyContent: 'center'}} onClick={handleSave} disabled={isSaving}>
              <Save size={20} /> {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button className="btn-icon" style={{width: '60px', height: '60px'}} onClick={() => setEditingPedido(null)} disabled={isSaving}>
              <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
