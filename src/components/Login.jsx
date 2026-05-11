import React, { useState } from 'react';
import { Heart, LogIn, Lock, User, Loader2 } from 'lucide-react';

const Login = ({ onLogin, loginError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setIsSubmitting(true);
    
    // Convertimos el usuario en un correo válido para Firebase por detrás
    const fakeEmail = `${username.trim().toLowerCase()}@mamiyoyita.com`;
    await onLogin(fakeEmail, password);
    setIsSubmitting(false);
  };

  return (
    <div className="login-screen" style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF5F7 0%, #F3E8FF 100%)'}}>
      <div className="modal-lux" style={{textAlign: 'center', maxWidth: '400px', width: '90%'}}>
         <div style={{marginBottom: '30px'}}>
           <Heart size={60} fill="#FFB7C5" color="#FF8DA1" style={{margin: '0 auto'}} />
           <h1 style={{fontFamily: 'Satisfy', fontSize: '40px', color: '#FF8DA1'}}>Delicias de la Mami Yoyita</h1>
           <p style={{fontFamily: 'Quicksand', color: '#717171'}}>Panel de Administración</p>
         </div>

         <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
           <div className="info-group" style={{textAlign: 'left'}}>
             <label className="info-label"><User size={12} /> Usuario</label>
             <input 
               className="premium-input" 
               type="text" 
               value={username} 
               onChange={e => setUsername(e.target.value)} 
               placeholder="ej: admin" 
               required
             />
           </div>

           <div className="info-group" style={{textAlign: 'left'}}>
             <label className="info-label"><Lock size={12} /> Contraseña</label>
             <input 
               className="premium-input" 
               type="password" 
               value={password} 
               onChange={e => setPassword(e.target.value)} 
               placeholder="••••••••" 
               required
             />
           </div>

           {loginError && (
             <div style={{color: '#EF4444', fontSize: '14px', fontWeight: '600', background: '#FEE2E2', padding: '10px', borderRadius: '10px'}}>
               ❌ Usuario o clave incorrectos.
             </div>
           )}

           <button 
             className="btn-main" 
             style={{width: '100%', marginTop: '10px', justifyContent: 'center'}} 
             type="submit"
             disabled={isSubmitting}
           >
             {isSubmitting ? <Loader2 className="animate-spin" /> : <LogIn size={20} />} 
             {isSubmitting ? 'Verificando...' : 'Entrar al Sistema'}
           </button>
         </form>
         
         <p style={{marginTop: '20px', fontSize: '12px', color: '#A1A1A1'}}>
           Protección de Datos Activa 🛡️
         </p>
      </div>
    </div>
  );
};

export default Login;
