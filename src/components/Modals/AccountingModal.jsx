import React from 'react';
import { X, TrendingUp, DollarSign, PieChart, ShoppingBag, Calendar, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const formatMonthName = (monthStr) => {
  if (!monthStr || !monthStr.includes('-')) return 'Mes Desconocido';
  try {
    const [year, month] = monthStr.split('-');
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${months[parseInt(month) - 1] || 'Mes'} ${year}`;
  } catch (e) {
    return 'Mes Inválido';
  }
};

const AccountingModal = ({ isOpen, onClose, selectedDate, deliveryStats, productStats, globalStats, monthlyStats }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-blur no-print">
      <div className="modal-lux" style={{maxWidth: '900px'}}>
        <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <Wallet size={32} color="#8B5CF6" />
            <h2 style={{margin: 0}}>Contabilidad y Balances</h2>
          </div>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>

        {/* SECCIÓN DE MESES SEPARADOS (MÁS PROMINENTE) */}
        <div style={{marginBottom: '40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#1E293B'}}>
            <Calendar size={22} color="#6366F1" />
            <h3 style={{margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px'}}>Balances Mensuales</h3>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {monthlyStats.map((item) => (
              <div key={item.month} style={{background: 'white', border: '1.5px solid #F1F5F9', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)'}}>
                <div style={{background: '#F8FAFC', padding: '15px 30px', borderBottom: '1.5px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '900', color: '#6366F1', fontSize: '16px', textTransform: 'uppercase'}}>{formatMonthName(item.month)}</span>
                  <div style={{background: '#EEF2FF', padding: '4px 15px', borderRadius: '50px', fontSize: '11px', fontWeight: '800', color: '#4338CA'}}>BALANCE DEL MES</div>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '25px 30px', gap: '20px'}}>
                  <div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', marginBottom: '8px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase'}}>
                      <ArrowUpCircle size={14} color="#10B981" /> Ingresos
                    </div>
                    <span style={{fontSize: '22px', fontWeight: '900', color: '#166534'}}>{formatCurrency(item.sales)}</span>
                  </div>
                  
                  <div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', marginBottom: '8px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase'}}>
                      <ArrowDownCircle size={14} color="#EF4444" /> Gastos
                    </div>
                    <span style={{fontSize: '22px', fontWeight: '900', color: '#991B1B'}}>{formatCurrency(item.expenses)}</span>
                  </div>

                  <div style={{background: '#F0FDF4', padding: '10px 20px', borderRadius: '20px', border: '1px solid #DCFCE7'}}>
                    <div style={{color: '#15803D', marginBottom: '5px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase'}}>Ganancia Neta</div>
                    <span style={{fontSize: '22px', fontWeight: '900', color: '#15803D'}}>{formatCurrency(item.profit)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESUMEN TOTAL HISTÓRICO */}
        <div style={{background: '#1E293B', padding: '30px', borderRadius: '40px', marginBottom: '40px', color: 'white', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
          <div style={{textAlign: 'center'}}>
            <p style={{margin: 0, fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px'}}>Ventas Totales</p>
            <p style={{margin: '5px 0 0', fontSize: '24px', fontWeight: '900', color: '#4ADE80'}}>{formatCurrency(globalStats.totalSales)}</p>
          </div>
          <div style={{width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)'}}></div>
          <div style={{textAlign: 'center'}}>
            <p style={{margin: 0, fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px'}}>Gastos Totales</p>
            <p style={{margin: '5px 0 0', fontSize: '24px', fontWeight: '900', color: '#F87171'}}>{formatCurrency(globalStats.totalExpenses)}</p>
          </div>
          <div style={{width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)'}}></div>
          <div style={{textAlign: 'center'}}>
            <p style={{margin: 0, fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px'}}>Utilidad Neta</p>
            <p style={{margin: '5px 0 0', fontSize: '28px', fontWeight: '900', color: '#FDE047'}}>{formatCurrency(globalStats.netProfit)}</p>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px'}}>
          {/* TOP PRODUCTOS DEL DÍA */}
          <div style={{background: '#F8FAFC', padding: '25px', borderRadius: '30px', border: '1px solid #F1F5F9'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#475569'}}>
              <ShoppingBag size={20} />
              <h3 style={{margin: 0, fontSize: '16px', fontWeight: '800'}}>Ventas de Hoy ({selectedDate})</h3>
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
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#6B21A8'}}>
              <DollarSign size={20} />
              <h3 style={{margin: 0, fontSize: '16px', fontWeight: '800'}}>Liquidación Domicilios</h3>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {deliveryStats.map(([movil, data]) => (
                <div key={movil} style={{background: 'white', padding: '15px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F3E8FF'}}>
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
      </div>
    </div>
  );
};

export default AccountingModal;
