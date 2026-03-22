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
    if (!name || name.length < 2) return setError('Please enter a valid name.');
    if (!phone || phone.length < 5) return setError('Please enter a valid phone number.');

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
      setError(res?.error || 'Failed to connect to Google Sheets. Verify your App Script URL inside src/services/api.js!');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', padding: '20px', textAlign: 'center' }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: '40px 20px', width: '100%', maxWidth: '350px' }}>
        <h2 className="cinzel" style={{ marginBottom: '10px', color: 'var(--accent-blue)' }}>Identify Thyself</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.9rem' }}>Enter your details to sync with the Google Sheet.</p>
        
        {error && <div style={{ color: '#ff4444', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
            style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
          />
          <input 
            type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
            style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
          />
          <GlowingButton type="submit" disabled={loading}>
            {loading ? 'Connecting to Sheets...' : 'Enter the Odyssey'}
          </GlowingButton>
        </form>
      </motion.div>
    </div>
  );
}
