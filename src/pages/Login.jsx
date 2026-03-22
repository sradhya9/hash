import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlowingButton from '../components/GlowingButton';
import { motion } from 'framer-motion';
import { saveUserLocally, getUserLocally, apiCall } from '../services/api';

export default function Login() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (getUserLocally()) {
      const pending = localStorage.getItem('pending_scan');
      if (pending) {
        localStorage.removeItem('pending_scan');
        navigate(`/scan?id=${pending}`);
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || name.length < 2) return setError('Please provide your full name.');
    
    // Validate 10-digit phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return setError('Mobile Number must be exactly 10 digits.');
    }

    setLoading(true);
    setError('');

    const res = await apiCall('register', { name, phone });
    
    if (res && res.success) {
      saveUserLocally(name, phone);
      const pending = localStorage.getItem('pending_scan');
      if (pending) {
        localStorage.removeItem('pending_scan');
        navigate(`/scan?id=${pending}`);
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res?.error || 'Login failed. Ensure thy name and mobile number are correct.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100dvh', 
      padding: '40px 20px', 
      textAlign: 'center',
      overflow: 'auto'
    }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: '40px 20px', width: '100%', maxWidth: '350px' }}>
        <h2 className="cinzel" style={{ marginBottom: '10px', color: 'var(--accent-gold)' }}>Identify Thyself</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.9rem', fontStyle: 'italic' }}>Offer thy details to be inscribed in the sacred records.</p>
        
        {error && <div style={{ color: '#ff4444', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
            style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}
          />
          <input 
            type="tel" placeholder="Mobile Number (10 digits)" value={phone} onChange={e => setPhone(e.target.value)}
            style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}
          />
          <GlowingButton type="submit" disabled={loading}>
            {loading ? 'Consulting the Oracle...' : 'Enter the Odyssey'}
          </GlowingButton>
        </form>
      </motion.div>
    </div>
  );
}
