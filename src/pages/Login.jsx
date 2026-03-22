import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlowingButton from '../components/GlowingButton';
import { motion } from 'framer-motion';

export default function Login() {
  const { loginWithGoogle, loginAnon, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel"
        style={{ padding: '40px 20px', width: '100%', maxWidth: '350px' }}
      >
        <h2 className="cinzel" style={{ marginBottom: '30px', color: 'var(--accent-blue)' }}>Authenticate</h2>
        
        <GlowingButton onClick={loginWithGoogle} variant="primary">
          Connect via Google
        </GlowingButton>

        <div style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>— OR —</div>

        <GlowingButton onClick={loginAnon} variant="secondary">
          Wanderer Access (Anon)
        </GlowingButton>
      </motion.div>
    </div>
  );
}
