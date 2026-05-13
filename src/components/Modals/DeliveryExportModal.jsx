import React, { useRef } from 'react';
import { X, Download, Share2, MapPin, Clock, Phone } from 'lucide-react';
import html2canvas from 'html2canvas';
import { formatTime12h, sortableTime } from '../../utils/formatters';

const DeliveryExportModal = ({ isOpen, onClose, displayPedidos, selectedDate }) => {
  const exportRef = useRef(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!exportRef.current) return;
    
    const canvas = await html2canvas(exportRef.current, {
      scale: 2, // Mejor calidad
      backgroundColor: '#FFFFFF',
      logging: false,
      useCORS: true
    });
    
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `Domicilios_${selectedDate}.png`;
    link.click();
  };

  // Ordenar cronológicamente usando la utilidad sortableTime
  const sortedPedidos = [...displayPedidos].sort((a, b) => {
    const timeA = sortableTime(a['Hora entrega']);
    const timeB = sortableTime(b['Hora entrega']);
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="modal-blur no-print">
      <div className="modal-lux" style={{maxWidth: '500px'}}>
        <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Share2 size={24} color="#6366F1" /> 
            Lista para Domiciliarios
          </h2>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>

        <p style={{color: '#717171', fontSize: '14px', marginBottom: '20px'}}>
          Esta es la vista que se descargará como imagen para tus domiciliarios.
        </p>

        {/* CONTENEDOR QUE SE CONVIERTE EN IMAGEN */}
        <div 
          ref={exportRef} 
          style={{
            padding: '30px', 
            background: 'white', 
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            color: '#1E293B'
          }}
        >
          <div style={{textAlign: 'center', marginBottom: '25px', borderBottom: '2px solid #F1F5F9', paddingBottom: '15px'}}>
            <h1 style={{margin: 0, fontSize: '24px', color: '#FF8DA1'}}>Delicias de la Mami Yoyita</h1>
            <p style={{margin: '5px 0', fontWeight: '700', color: '#64748B'}}>LISTA DE DOMICILIOS - {selectedDate}</p>
            <p style={{margin: 0, fontSize: '14px', color: '#94A3B8'}}>Total Pedidos: {sortedPedidos.length}</p>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            {sortedPedidos.map((p, index) => (
              <div key={p.internalId} style={{paddingBottom: '15px', borderBottom: '1px dashed #E2E8F0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                  <span style={{fontSize: '18px', fontWeight: '900', color: '#1E293B'}}>
                    #{p['Unnamed: 0']} - {p.Pedido}
                  </span>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', background: '#F1F5F9', padding: '4px 8px', borderRadius: '8px', fontSize: '14px', fontWeight: '700'}}>
                    <Clock size={14} /> {formatTime12h(p['Hora entrega'])}
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '15px', marginBottom: '5px'}}>
                  <MapPin size={16} color="#6366F1" />
                  <span style={{fontWeight: '600'}}>{p.Direccion}</span>
                </div>

                <div style={{display: 'flex', gap: '15px', marginLeft: '24px', fontSize: '13px', color: '#64748B'}}>
                  <span>👤 {p['nombre cliente']}</span>
                  <span>📞 {p.Telefono}</span>
                  {p.telefonoReceptor && <span>📱 Recibe: {p.telefonoReceptor}</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop: '25px', textAlign: 'center', fontSize: '12px', color: '#94A3B8'}}>
            Generado por Gestión Mami Yoyita
          </div>
        </div>

        <div style={{marginTop: '25px'}}>
          <button 
            className="btn-main" 
            style={{width: '100%', background: '#6366F1', justifyContent: 'center'}}
            onClick={handleDownload}
          >
            <Download size={20} /> Descargar Imagen (PNG)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryExportModal;
