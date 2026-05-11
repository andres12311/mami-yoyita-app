import React from 'react';
import { Phone, Edit2, Trash2, Clock, MapPin, Share2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const getStatusInfo = (status) => {
  switch(status) {
    case 'listo': return { label: 'Listo', color: '#10B981', icon: <CheckCircle2 size={14} /> };
    case 'proceso': return { label: 'En Proceso', color: '#F59E0B', icon: <Loader2 size={14} className="animate-spin" /> };
    default: return { label: 'Pendiente', color: '#EF4444', icon: <AlertCircle size={14} /> };
  }
};

const OrderCard = ({ pedido, onWhatsApp, onEdit, onDelete, onUpdateStatus, onSavePedido }) => {
  const s = getStatusInfo(pedido.status);

  const handleDelete = () => {
    const clientName = pedido['nombre cliente'] || 'Sin nombre';
    if (window.confirm(`⚠️ ¿Estás segura de eliminar el pedido #${pedido['Unnamed: 0']} de "${clientName}"?\n\nEsta acción no se puede deshacer.`)) {
      onDelete(pedido.internalId);
    }
  };
  
  return (
    <div className="premium-card">
      <div className="card-header">
        <div className="badge-status" style={{background: `${s.color}15`, color: s.color}}>{s.icon} {s.label}</div>
        <div className="no-print" style={{display: 'flex', gap: '10px'}}>
          <button className="btn-icon" style={{background: '#DCFCE7', color: '#15803D'}} title="Enviar WhatsApp" onClick={() => onWhatsApp(pedido)}><Phone size={16} /></button>
          <button className="btn-icon" onClick={() => onEdit({...pedido})}><Edit2 size={16} /></button>
          <button className="btn-icon" style={{color: '#FF8DA1'}} onClick={handleDelete}><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="card-body">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <span style={{fontSize: '18px', fontWeight: '900', color: '#FFB7C5'}}>ORDEN #{pedido['Unnamed: 0']}</span>
          <div className="delivery-tag"><Clock size={16} /> {pedido['Hora entrega'] || '--:--'}</div>
        </div>
        <h2 className="product-title">{pedido.Pedido}</h2>
        
        <div className="info-group">
          <span className="info-label">Cliente</span>
          <span className="info-value">{pedido['nombre cliente']} <span style={{color: '#717171', fontWeight: '400', fontSize: '15px'}}>• {pedido.Telefono}</span></span>
        </div>

        <div className="address-box" style={{position: 'relative'}}>
          <div className="info-label" style={{color: '#717171', marginBottom: '8px', fontSize: '12px'}}>Lugar de Entrega</div>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <MapPin size={22} style={{color: '#FFB7C5', flexShrink: 0}} />
            <span style={{flex: 1}}>{pedido.Direccion}</span>
            <button 
              className="btn-icon no-print" 
              style={{background: '#EEF2FF', color: '#4F46E5'}} 
              title="Ver en Google Maps"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pedido.Direccion + " Ibagué")}`, '_blank')}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F5F9', padding: '10px', borderRadius: '15px', marginTop: '15px'}}>
            <div className="info-label" style={{fontSize: '10px'}}>MÓVIL:</div>
            <input 
              type="text" 
              placeholder="Ej: 1" 
              value={pedido.movil || ''} 
              onChange={(e) => onSavePedido({ ...pedido, movil: e.target.value })}
              style={{width: '60px', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '4px 8px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center'}}
            />
            <div style={{flex: 1, textAlign: 'right', fontSize: '12px', fontWeight: 'bold', color: '#0369A1'}}>
              Envío: {formatCurrency(pedido.precioDomicilio)}
            </div>
        </div>

        <div className="info-group">
          <span className="info-label">Detalles del Pedido</span>
          <div style={{background: '#F8FAFC', padding: '20px', borderRadius: '20px', fontSize: '18px', fontStyle: 'italic', color: '#717171', border: '1px dashed #E2E8F0', lineHeight: '1.5'}}>
            {pedido.Ingredientes || 'Sin detalles adicionales'}
          </div>
        </div>

        <div className="status-selector no-print" style={{display: 'flex', gap: '10px', justifyContent: 'center', background: '#F8FAFC', padding: '15px', borderRadius: '25px', marginTop: '20px'}}>
          <button className={`status-btn ${pedido.status === 'pendiente' ? 'active' : ''}`} style={{background: '#FEE2E2', color: '#EF4444'}} onClick={() => onUpdateStatus(pedido.internalId, 'pendiente')}>Pendiente</button>
          <button className={`status-btn ${pedido.status === 'proceso' ? 'active' : ''}`} style={{background: '#FEF3C7', color: '#F59E0B'}} onClick={() => onUpdateStatus(pedido.internalId, 'proceso')}>En Proceso</button>
          <button className={`status-btn ${pedido.status === 'listo' ? 'active' : ''}`} style={{background: '#D1FAE5', color: '#10B981'}} onClick={() => onUpdateStatus(pedido.internalId, 'listo')}>Listo</button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
