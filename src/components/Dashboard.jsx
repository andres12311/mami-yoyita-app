import React from 'react';
import { Package, TrendingUp, BarChart3, Heart } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const Dashboard = ({ pedidosCount, totalVentas, totalGastos, utilidad }) => {
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
