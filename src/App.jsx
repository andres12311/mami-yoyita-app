import React, { useState, useMemo } from 'react';
import './styles/main.css';
import { Loader2 } from 'lucide-react';

// Hooks
import { useAuth } from './hooks/useAuth';
import { usePedidos } from './hooks/usePedidos';
import { useStats } from './hooks/useStats';

// Components
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import OrderCard from './components/OrderCard';

// Modals
import EditOrderModal from './components/Modals/EditOrderModal';
import AccountingModal from './components/Modals/AccountingModal';
import SummaryModal from './components/Modals/SummaryModal';
import ExpenseModal from './components/Modals/ExpenseModal';
import DeliveryExportModal from './components/Modals/DeliveryExportModal';

// Services
import { savePedidoCloud, deletePedidoCloud, saveConfigCloud } from './services/firebaseService';
import { sortableTime } from './utils/formatters';

function App() {
  const { isAuthenticated, loading: authLoading, error: authError, login, logout } = useAuth();
  const { 
    pedidos, 
    produccionManual, 
    gastosDetalle, 
    setGastosDetalle 
  } = usePedidos(isAuthenticated);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortConfig, setSortConfig] = useState({ key: 'Hora entrega', direction: 'asc' });
  const [editingPedido, setEditingPedido] = useState(null);
  
  // Modal states
  const [showSummary, setShowSummary] = useState(false);
  const [showAccounting, setShowAccounting] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [showDeliveryExport, setShowDeliveryExport] = useState(false);

  // Filter & Sort Logic
  const displayPedidos = useMemo(() => {
    return [...pedidos]
      .filter(p => {
        const matchesDate = p.fechaEntrega === selectedDate;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return (
            (p['nombre cliente'] || '').toLowerCase().includes(term) ||
            (p.Pedido || '').toLowerCase().includes(term) ||
            (p.Ingredientes || '').toLowerCase().includes(term) ||
            (p['Unnamed: 0'] || '').toString().includes(term)
          );
        }
        return matchesDate;
      })
      .sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === 'Hora entrega') {
          valA = sortableTime(a['Hora entrega']);
          valB = sortableTime(b['Hora entrega']);
        } else {
          valA = parseInt(a['Unnamed: 0'] || 0);
          valB = parseInt(b['Unnamed: 0'] || 0);
        }
        if (valA === valB) return a.internalId > b.internalId ? 1 : -1;
        
        let comparison;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else {
          comparison = valA - valB;
        }
        
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
  }, [pedidos, searchTerm, sortConfig, selectedDate]);

  const stats = useStats(pedidos, displayPedidos, selectedDate, produccionManual, gastosDetalle);

  const handleUpdateStatus = (id, newStatus) => {
    const pedido = pedidos.find(p => p.internalId === id);
    if (pedido) {
      savePedidoCloud({ ...pedido, status: newStatus });
      if (newStatus === 'listo') {
        const confirmSend = window.confirm(`¿Quieres enviar la notificación de despacho a ${pedido['nombre cliente']} por WhatsApp?`);
        if (confirmSend) {
          const phone = pedido.Telefono.replace(/\D/g, '');
          const message = `¡Hola ${pedido['nombre cliente']}! 🌸 Te saludamos de *Delicias de la Mami Yoyita*. Tu pedido ya salió!`;
          window.open(`https://wa.me/57${phone}?text=${encodeURIComponent(message)}`, '_blank');
        }
      }
    }
  };

  const handleWhatsApp = (pedido) => {
    const phone = pedido.Telefono.replace(/\D/g, '');
    const message = `¡Hola ${pedido['nombre cliente']}! 🌸 Confirmamos tu pedido de ${pedido.Pedido}.`;
    window.open(`https://wa.me/57${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleNewPedido = () => {
    const dayOrders = pedidos.filter(p => p.fechaEntrega === selectedDate);
    const maxOrder = dayOrders.length > 0 ? Math.max(...dayOrders.map(p => parseInt(p['Unnamed: 0']) || 0)) : 0;
    setEditingPedido({ 
      internalId: `new-${Date.now()}`, 
      'Unnamed: 0': maxOrder + 1, 
      Pedido: '', 
      'nombre cliente': '', 
      Direccion: '', 
      Telefono: '', 
      telefonoReceptor: '',
      'Hora entrega': '', 
      Ingredientes: '', 
      precioDesayuno: 0, 
      precioDomicilio: 0, 
      fechaEntrega: selectedDate, 
      status: 'pendiente', 
      isNew: true 
    });
  };

  if (authLoading) {
    return (
      <div style={{height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF5F7 0%, #F3E8FF 100%)'}}>
        <Loader2 className="animate-spin" size={60} color="#FF8DA1" />
        <p style={{marginTop: '20px', fontWeight: '600', color: '#717171'}}>Cargando portal seguro...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} loginError={authError} />;
  }

  return (
    <div className="app-container">
      <Header 
        setShowExpenses={setShowExpenses}
        setShowAccounting={setShowAccounting}
        setShowSummary={setShowSummary}
        logout={logout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        onNewPedido={handleNewPedido}
        setShowDeliveryExport={setShowDeliveryExport}
      />

      <Dashboard 
        pedidosCount={displayPedidos.length}
        totalVentas={stats.totalVentasDia}
        totalGastos={stats.totalGastosDia}
        utilidad={stats.utilidadDia}
      />

      <div className="orders-grid">
        {displayPedidos.map(pedido => (
          <OrderCard 
            key={pedido.internalId}
            pedido={pedido}
            onWhatsApp={handleWhatsApp}
            onEdit={setEditingPedido}
            onDelete={deletePedidoCloud}
            onUpdateStatus={handleUpdateStatus}
            onSavePedido={savePedidoCloud}
          />
        ))}
      </div>

      <EditOrderModal 
        editingPedido={editingPedido} 
        setEditingPedido={setEditingPedido} 
        onSave={() => { savePedidoCloud(editingPedido); setEditingPedido(null); }} 
      />

      <AccountingModal 
        isOpen={showAccounting} 
        onClose={() => setShowAccounting(false)} 
        selectedDate={selectedDate} 
        deliveryStats={stats.deliveryStats} 
        productStats={stats.productStats} 
        globalStats={stats.globalStats}
        monthlyStats={stats.monthlyStats}
      />

      <SummaryModal 
        isOpen={showSummary} 
        onClose={() => setShowSummary(false)} 
        productionSummary={stats.productionSummary} 
        rawMaterialSummary={stats.rawMaterialSummary}
      />

      <ExpenseModal 
        isOpen={showExpenses} 
        onClose={() => setShowExpenses(false)} 
        selectedDate={selectedDate} 
        gastosDetalle={gastosDetalle} 
        onSaveGastos={(data) => { setGastosDetalle(data); saveConfigCloud('gastos', data); }} 
      />

      <DeliveryExportModal 
        isOpen={showDeliveryExport} 
        onClose={() => setShowDeliveryExport(false)} 
        displayPedidos={displayPedidos}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default App;
