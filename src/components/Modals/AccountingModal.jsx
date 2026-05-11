import React from 'react';
import { X, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const AccountingModal = ({ isOpen, onClose, selectedDate, deliveryStats, productStats }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-blur no-print">
      <div className="modal-lux" style={{maxWidth: '700px'}}>
        <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
          <h2><TrendingUp size={28} /> Liquidación de Domiciliarios</h2>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>
        
        <div style={{background: '#F8FAFC', padding: '20px', borderRadius: '25px', marginBottom: '25px'}}>
           <p style={{margin: 0, fontSize: '12px', fontWeight: '800', color: '#717171', textTransform: 'uppercase'}}>Fecha de Corte</p>
           <p style={{margin: 0, fontSize: '20px', fontWeight: '800'}}>{selectedDate}</p>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
           <div style={{background: '#FFF1F2', padding: '15px', borderRadius: '20px', marginBottom: '10px'}}>
              <h3 style={{margin: '0 0 10px 0', fontSize: '14px', color: '#E11D48'}}>📊 Top Productos (Hoy)</h3>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {productStats.map(([name, count]) => (
                  <div key={name} style={{background: 'white', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', border: '1px solid #FFE4E6'}}>
                    <span style={{fontWeight: '800'}}>{count}x</span> {name}
                  </div>
                ))}
              </div>
           </div>

           {deliveryStats.map(([movil, data]) => (
             <div key={movil} style={{background: 'white', border: '1px solid #E2E8F0', padding: '20px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <span style={{background: '#8B5CF6', color: 'white', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold'}}>MÓVIL {movil}</span>
                  <p style={{margin: '5px 0 0', fontSize: '14px', color: '#717171'}}>{data.count} pedidos entregados</p>
                </div>
                <div style={{textAlign: 'right'}}>
                   <p style={{margin: 0, fontSize: '12px', fontWeight: '800', color: '#717171'}}>POR PAGAR</p>
                   <p style={{margin: 0, fontSize: '22px', fontWeight: '800', color: '#10B981'}}>{formatCurrency(data.totalPay)}</p>
                </div>
             </div>
           ))}
           {deliveryStats.length === 0 && (
             <p style={{textAlign: 'center', padding: '40px', color: '#717171'}}>Aún no has asignado móviles a los pedidos de hoy.</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default AccountingModal;
