import React from 'react';
import { Heart, Sparkles, BarChart3, TrendingUp, ClipboardList, Plus, Printer, Lock, Search, Share2, ShoppingBag } from 'lucide-react';

const Header = ({ 
  setShowExpenses, 
  setShowAccounting, 
  setShowSummary, 
  setEditingPedido, 
  logout, 
  searchTerm, 
  setSearchTerm, 
  selectedDate, 
  setSelectedDate, 
  sortConfig, 
  setSortConfig,
  onNewPedido,
  setShowDeliveryExport,
  setShowCatalogAdmin
}) => {
  return (
    <div className="main-header no-print">
      <div className="header-row">
        <div className="brand-logo" onClick={() => window.open('https://www.instagram.com/deliciasdelamamiyoyita/', '_blank')}>
          <div style={{position: 'relative'}}>
            <Heart size={55} fill="#FFB7C5" color="#FF8DA1" />
            <Sparkles size={22} color="#FFD700" style={{position: 'absolute', top: -5, right: -5}} />
          </div>
          <div className="logo-text">
            <div className="logo-top">Delicias de la</div>
            <div className="logo-bottom">Mami Yoyita</div>
          </div>
        </div>
        
        <div className="controls-row">
           <button className="btn-main" style={{background: '#6366F1'}} onClick={() => setShowExpenses(true)}><BarChart3 size={20} /> Gastos</button>
           <button className="btn-main" style={{background: '#8B5CF6'}} onClick={() => setShowAccounting(true)}><TrendingUp size={20} /> Contabilidad</button>
           <button className="btn-main" style={{background: '#717171'}} onClick={() => setShowSummary(true)}><ClipboardList size={20} /> Producción</button>
           <button className="btn-main" style={{background: '#0EA5E9'}} onClick={() => setShowDeliveryExport(true)}><Share2 size={20} /> Domicilios</button>
           <button className="btn-main" style={{background: '#EC4899'}} onClick={() => setShowCatalogAdmin(true)}><ShoppingBag size={20} /> Catálogo</button>
           <button className="btn-main" onClick={onNewPedido}><Plus size={20} /> Nuevo Pedido</button>
           <button className="btn-icon" onClick={() => window.print()}><Printer size={22} /></button>
           <button className="btn-icon" title="Cerrar Sesión" onClick={logout}><Lock size={18} /></button>
        </div>
      </div>

      <div className="header-row" style={{borderTop: '1.5px solid #F1F5F9', paddingTop: '25px'}}>
        <div className="search-box">
          <Search size={22} />
          <input 
            type="text" 
            className="premium-input" 
            placeholder="Buscar por cliente, producto o dirección..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="controls-row">
          <div className="info-label">Entrega:</div>
          <input 
            type="date" 
            className="premium-input" 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)} 
          />
          <div className="info-label">Ordenar:</div>
          <select 
            className="premium-input" 
            value={`${sortConfig.key}-${sortConfig.direction}`} 
            onChange={e => { 
              const [key, direction] = e.target.value.split('-'); 
              setSortConfig({ key, direction }); 
            }}
          >
            <option value="Hora entrega-asc">⏰ Más temprano</option>
            <option value="Hora entrega-desc">⏰ Más tarde</option>
            <option value="Unnamed: 0-asc">🔢 Por número</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Header;
