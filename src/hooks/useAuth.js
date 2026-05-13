import { useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';
import { logger } from '../utils/logger';

// Anti brute-force: máximo de intentos y bloqueo temporal
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 2 * 60 * 1000; // 2 minutos de bloqueo

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loginAttempts = useRef(0);
  const lockoutUntil = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);

      // Verificar bloqueo temporal
      const now = Date.now();
      if (now < lockoutUntil.current) {
        const secsLeft = Math.ceil((lockoutUntil.current - now) / 1000);
        setError(`🔒 Demasiados intentos. Espera ${secsLeft} segundos.`);
        return false;
      }

      // Sanitizar inputs
      const cleanEmail = email.trim().toLowerCase().substring(0, 100);
      const cleanPassword = password.substring(0, 128);

      if (!cleanEmail || !cleanPassword) {
        setError("Por favor ingresa usuario y contraseña.");
        return false;
      }

      await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      
      // Reset en login exitoso
      loginAttempts.current = 0;
      lockoutUntil.current = 0;
      return true;
    } catch (err) {
      loginAttempts.current += 1;
      logger.error(`Intento de login fallido #${loginAttempts.current}`);

      // Activar bloqueo si se exceden los intentos
      if (loginAttempts.current >= MAX_ATTEMPTS) {
        lockoutUntil.current = Date.now() + LOCKOUT_DURATION_MS;
        loginAttempts.current = 0;
        setError(`🔒 Cuenta bloqueada temporalmente por seguridad. Intenta en 2 minutos.`);
      } else {
        const remaining = MAX_ATTEMPTS - loginAttempts.current;
        setError(`Credenciales inválidas. ${remaining} intento(s) restante(s).`);
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      logger.error("Error de logout:", err);
    }
  };

  return { 
    isAuthenticated: !!user, 
    user, 
    loading, 
    error,
    login, 
    logout 
  };
};
