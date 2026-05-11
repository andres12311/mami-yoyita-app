import React, { useState } from 'react';
import { X, BarChart3, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const ExpenseModal = ({ isOpen, onClose, selectedDate, gastosDetalle, onSaveGastos }) => {
  const [newExpense, setNewExpense] = useState({ desc: '', monto: '' });
  if (!isOpen) return null;

  const currentGastos = gastosDetalle[selectedDate] || [];

  const handleAdd = () => {
    const desc = (newExpense.desc || '').trim();
    const monto = parseFloat(newExpense.monto);
    if (!desc) {
      alert('Ingresa una descripción para el gasto.');
      return;
    }
    if (isNaN(monto) || monto <= 0) {
      alert('El monto debe ser un número positivo.');
      return;
    }
    const updated = {
      ...gastosDetalle,
      [selectedDate]: [...currentGastos, { id: Date.now(), desc, monto: monto.toString() }]
    };
    onSaveGastos(updated);
    setNewExpense({ desc: '', monto: '' });
  };

  const handleDelete = (id) => {
    const updated = {
      ...gastosDetalle,
      [selectedDate]: currentGastos.filter(g => g.id !== id)
    };
    onSaveGastos(updated);
  };

  return (
    <div className="modal-blur no-print">
      <div className="modal-lux" style={{maxWidth: '600px'}}>
        <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
          <h2><BarChart3 size={28} /> Gastos del Día</h2>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>

        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
          <input 
            className="premium-input" 
            placeholder="Descripción..." 
            value={newExpense.desc} 
            onChange={e => setNewExpense({...newExpense, desc: e.target.value})} 
            maxLength={100}
          />
          <input 
            className="premium-input" 
            type="number" 
            min="0"
            max="50000000"
            step="100"
            placeholder="Monto $" 
            value={newExpense.monto} 
            onChange={e => setNewExpense({...newExpense, monto: e.target.value})} 
          />
          <button className="btn-main" onClick={handleAdd}><Plus /></button>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {currentGastos.map(g => (
            <div key={g.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#F8FAFC', borderRadius: '15px'}}>
              <div>
                <p style={{margin: 0, fontWeight: '700'}}>{g.desc}</p>
                <p style={{margin: 0, fontSize: '14px', color: '#10B981'}}>{formatCurrency(g.monto)}</p>
              </div>
              <button className="btn-icon" style={{color: '#EF4444'}} onClick={() => handleDelete(g.id)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
