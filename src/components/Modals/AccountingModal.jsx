import React from 'react';
import { X, TrendingUp, DollarSign, PieChart, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const AccountingModal = ({ isOpen, onClose, selectedDate, deliveryStats, productStats, globalStats }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-blur no-print">
      <div className="modal-lux" style={{maxWidth: '800px'}}>
        <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <TrendingUp size={32} color="#8B5CF6" />
            <h2 style={{margin: 0}}>Contabilidad General</h2>
          </div>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>
        
        {/* RESUMEN GLOBAL */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px'}}>
          <div style={{background: '#F0FDF4', padding: '25px', borderRadius: '30px', border: '1px solid #DCFCE7'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#15803D', marginBottom: '10px'}}>
              <DollarSign size={20} />
              <span style={{fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px'}}>Ingresos Totales</span>
            </div>
            <p style={{margin: 0, fontSize: '24px', fontWeight: '900', color: '#166534'}}>{formatCurrency(globalStats.totalSales)}</p>
            <p style={{margin: '5px 0 0', fontSize: '11px', color: '#15803D', opacity: 0.7}}>Acumulado histórico</p>
          </div>

          <div style={{background: '#FEF2F2', padding: '25px', borderRadius: '30px', border: '1px solid #FEE2E2'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#B91C1C', marginBottom: '10px'}}>
              <PieChart size={20} />
              <span style={{fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px'}}>Gastos Totales</span>
            </div>
            <p style={{margin: 0, fontSize: '24px', fontWeight: '900', color: '#991B1B'}}>{formatCurrency(globalStats.totalExpenses)}</p>
            <p style={{margin: '5px 0 0', fontSize: '11px', color: '#B91C1C', opacity: 0.7}}>Todos los meses</p>
          </div>

          <div style={{background: '#EEF2FF', padding: '25px', borderRadius: '30px', border: '1px solid #E0E7FF', gridColumn: 'span 1'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#4338CA', marginBottom: '10px'}}>
              <TrendingUp size={20} />
              <span style={{fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px'}}>Ganancia Neta</span>
            </div>
            <p style={{margin: 0, fontSize: '24px', fontWeight: '900', color: '#3730A3'}}>{formatCurrency(globalStats.netProfit)}</p>
            <p style={{margin: '5px 0 0', fontSize: '11px', color: '#4338CA', opacity: 0.7}}>Fuera de gastos</p>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px'}}>
          {/* TOP PRODUCTOS */}
          <div style={{background: '#F8FAFC', padding: '25px', borderRadius: '30px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#475569'}}>
              <ShoppingBag size={20} />
              <h3 style={{margin: 0, fontSize: '16px', fontWeight: '800'}}>Ventas de Hoy</h3>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {productStats.map(([name, count]) => (
                <div key={name} style={{background: 'white', padding: '12px 18px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0'}}>
                  <span style={{fontSize: '14px', fontWeight: '600', color: '#475569'}}>{name}</span>
                  <span style={{background: '#F1F5F9', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', color: '#1E293B'}}>{count}</span>
                </div>
              ))}
              {productStats.length === 0 && <p style={{fontSize: '13px', color: '#94A3B8', textAlign: 'center'}}>No hay ventas hoy</p>}
            </div>
          </div>

          {/* LIQUIDACION DOMICILIARIOS */}
          <div style={{background: '#FAF5FF', padding: '25px', borderRadius: '30px', border: '1px solid #F3E8FF'}}>
            <h3 style={{margin: '0 0 20px 0', fontSize: '16px', fontWeight: '800', color: '#6B21A8'}}>Liquidación Domicilios</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {deliveryStats.map(([movil, data]) => (
                <div key={movil} style={{background: 'white', padding: '15px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
                  <div>
                    <span style={{fontSize: '11px', fontWeight: '800', color: '#A855F7', textTransform: 'uppercase'}}>Móvil {movil}</span>
                    <p style={{margin: 0, fontSize: '13px', color: '#64748B'}}>{data.count} entregas</p>
                  </div>
                  <span style={{fontSize: '16px', fontWeight: '900', color: '#7E22CE'}}>{formatCurrency(data.totalPay)}</span>
                </div>
              ))}
              {deliveryStats.length === 0 && <p style={{fontSize: '13px', color: '#94A3B8', textAlign: 'center'}}>Sin domicilios hoy</p>}
            </div>
          </div>
        </div>

        <div style={{marginTop: '30px', textAlign: 'center', color: '#94A3B8', fontSize: '12px'}}>
           Mostrando datos para el día: <strong>{selectedDate}</strong> y totales históricos.
        </div>
      </div>
    </div>
  );
};

export default AccountingModal;
