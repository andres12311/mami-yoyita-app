import React from 'react';
import { Package, TrendingUp, BarChart3, Heart, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const Dashboard = ({ pedidosCount, totalVentas, totalGastos, utilidad, isOperativo, statusCounts = { pendientes: 0, proceso: 0, listos: 0 } }) => {
  if (isOperativo) {
    return (
      <div className="dashboard-grid no-print">
        <div className="dashboard-card">
          <div className="dash-icon" style={{background: '#FFF1F2'}}><Package size={32} color="#FF8DA1" /></div>
          <div className="dash-info"><h3>Pedidos de Hoy</h3><p>{pedidosCount}</p></div>
        </div>
        <div className="dashboard-card">
          <div className="dash-icon" style={{background: '#FEF2F2', color: '#EF4444'}}><AlertCircle size={32} /></div>
          <div className="dash-info"><h3>Por Iniciar</h3><p style={{color: '#EF4444'}}>{statusCounts.pendientes}</p></div>
        </div>
        <div className="dashboard-card">
          <div className="dash-icon" style={{background: '#FFFBEB', color: '#F59E0B'}}><Loader2 size={32} /></div>
          <div className="dash-info"><h3>En Proceso</h3><p style={{color: '#F59E0B'}}>{statusCounts.proceso}</p></div>
        </div>
        <div className="dashboard-card" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white'}}>
          <div className="dash-icon" style={{background: 'rgba(255,255,255,0.2)', color: 'white'}}><CheckCircle2 size={32} /></div>
          <div className="dash-info"><h3 style={{color: 'rgba(255,255,255,0.85)'}}>Listos para Entrega</h3><p style={{color: 'white'}}>{statusCounts.listos}</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid no-print">
      <div className="dashboard-card">
        <div className="dash-icon" style={{background: '#FFF1F2'}}><Package size={32} /></div>
        <div className="dash-info"><h3>Pedidos de Hoy</h3><p>{pedidosCount}</p></div>
      </div>
      <div className="dashboard-card">
        <div className="dash-icon" style={{background: '#F0FDF4', color: '#10B981'}}><TrendingUp size={32} /></div>
        <div className="dash-info"><h3>Ventas Brutas</h3><p>{formatCurrency(totalVentas)}</p></div>
      </div>
      <div className="dashboard-card">
        <div className="dash-icon" style={{background: '#F8FAFC', color: '#6366F1'}}><BarChart3 size={32} /></div>
        <div className="dash-info"><h3>Inversión/Gastos</h3><p>{formatCurrency(totalGastos)}</p></div>
      </div>
      <div className="dashboard-card" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white'}}>
        <div className="dash-icon" style={{background: 'rgba(255,255,255,0.2)', color: 'white'}}><Heart size={32} fill="white" /></div>
        <div className="dash-info"><h3 style={{color: 'rgba(255,255,255,0.8)'}}>Utilidad Neta</h3><p style={{color: 'white'}}>{formatCurrency(utilidad)}</p></div>
      </div>
    </div>
  );
};

export default Dashboard;
