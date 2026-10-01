import { useState, useEffect } from 'react';

const STORAGE_KEY_MODE = 'mami_yoyita_view_mode';
const STORAGE_KEY_PIN = 'mami_yoyita_admin_pin';
const DEFAULT_PIN = '1234';

export const useViewMode = () => {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_MODE) || 'operativo';
  });

  const [pin, setPinState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_PIN) || DEFAULT_PIN;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODE, viewMode);
  }, [viewMode]);

  const unlockAdmin = (enteredPin) => {
    if (enteredPin === pin) {
      setViewMode('admin');
      return { success: true };
    }
    return { success: false, error: 'PIN incorrecto' };
  };

  const lockOperativo = () => {
    setViewMode('operativo');
  };

  const updatePin = (currentPin, newPin) => {
    if (currentPin !== pin) {
      return { success: false, error: 'El PIN actual es incorrecto' };
    }
    if (!newPin || newPin.length < 4) {
      return { success: false, error: 'El nuevo PIN debe tener al menos 4 dígitos' };
    }
    setPinState(newPin);
    localStorage.setItem(STORAGE_KEY_PIN, newPin);
    return { success: true };
  };

  return {
    viewMode,
    isAdmin: viewMode === 'admin',
    isOperativo: viewMode === 'operativo',
    unlockAdmin,
    lockOperativo,
    updatePin,
    currentPin: pin
  };
};
