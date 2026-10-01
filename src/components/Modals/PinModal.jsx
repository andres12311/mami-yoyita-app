import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, ShieldCheck, KeyRound } from 'lucide-react';

const PinModal = ({ isOpen, onClose, onUnlock, currentPin }) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setError('');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setError('Por favor ingresa el PIN');
      return;
    }

    const res = onUnlock(pinInput.trim());
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'PIN incorrecto');
      setPinInput('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="modal-blur no-print" style={{ zIndex: 1100 }}>
      <div className="modal-lux" style={{ maxWidth: '420px', textAlign: 'center', padding: '35px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#E11D48',
          boxShadow: '0 8px 20px rgba(225, 29, 72, 0.15)'
        }}>
          <Lock size={34} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', margin: '0 0 8px' }}>
          Modo Administrador
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 25px', lineHeight: '1.4' }}>
          Ingresa el PIN de seguridad para acceder a la contabilidad, ventas y utilidades.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pinInput}
              onChange={(e) => {
                setError('');
                setPinInput(e.target.value);
              }}
              placeholder="••••"
              className="premium-input"
              style={{
                width: '100%',
                fontSize: '28px',
                textAlign: 'center',
                letterSpacing: '8px',
                padding: '12px 20px',
                fontWeight: '800'
              }}
              autoComplete="off"
            />
          </div>

          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#DC2626',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-main"
            style={{
              width: '100%',
              justifyContent: 'center',
              background: '#E11D48',
              boxShadow: '0 4px 15px rgba(225, 29, 72, 0.3)',
              padding: '14px',
              fontSize: '16px'
            }}
          >
            <ShieldCheck size={20} /> Desbloquear Modo Admin
          </button>

          {currentPin === '1234' && (
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              💡 PIN predeterminado: <strong>1234</strong>
            </span>
          )}
        </form>
      </div>
    </div>
  );
};

export default PinModal;
