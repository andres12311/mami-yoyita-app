import React from 'react';
import { X, Save } from 'lucide-react';

const EditOrderModal = ({ editingPedido, setEditingPedido, onSave }) => {
  if (!editingPedido) return null;

  const handleChange = (field, value) => {
    setEditingPedido({ ...editingPedido, [field]: value });
  };

  const handleNumericChange = (field, value) => {
    const num = parseFloat(value);
    handleChange(field, isNaN(num) || num < 0 ? 0 : num);
  };

  const handleSave = () => {
    // Validación mínima antes de guardar
    if (!editingPedido.Pedido || !editingPedido.Pedido.trim()) {
      alert('El campo "Pedido / Producto" es obligatorio.');
      return;
    }
    if (!editingPedido['nombre cliente'] || !editingPedido['nombre cliente'].trim()) {
      alert('El campo "Nombre del Cliente" es obligatorio.');
      return;
    }
    onSave();
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
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <div className="info-group">
              <label className="info-label">Teléfono</label>
              <input 
                className="premium-input" 
                type="tel"
                inputMode="numeric"
                value={editingPedido.Telefono || ''} 
                onChange={e => handleChange('Telefono', e.target.value.replace(/[^0-9+() -]/g, ''))} 
                maxLength={20}
                placeholder="3001234567"
              />
            </div>
            <div className="info-group">
              <label className="info-label">Hora Entrega</label>
              <input 
                className="premium-input" 
                type="time"
                value={editingPedido['Hora entrega'] || ''} 
                onChange={e => handleChange('Hora entrega', e.target.value)} 
              />
            </div>
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
              placeholder="Nombre del producto"
            />
          </div>

          <div className="info-group">
            <label className="info-label">Detalles / Ingredientes</label>
            <textarea 
              className="premium-input" 
              style={{height: '100px', resize: 'none'}} 
              value={editingPedido.Ingredientes || ''} 
              onChange={e => handleChange('Ingredientes', e.target.value)} 
              maxLength={500}
              placeholder="Detalles adicionales del pedido"
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
                value={editingPedido.precioDesayuno || 0} 
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
                value={editingPedido.precioDomicilio || 0} 
                onChange={e => handleNumericChange('precioDomicilio', e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{marginTop: '30px', display: 'flex', gap: '15px'}}>
          <button className="btn-main" style={{flex: 1, justifyContent: 'center'}} onClick={handleSave}>
            <Save size={20} /> Guardar Cambios
          </button>
          <button className="btn-icon" style={{width: '60px', height: '60px'}} onClick={() => setEditingPedido(null)}>
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
