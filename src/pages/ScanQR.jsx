import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlowingButton from '../components/GlowingButton';
import BottomNav from '../components/BottomNav';
import { getUserLocally, apiCall } from '../services/api';

export default function ScanQR() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get('id');
  const navigate = useNavigate();
  const user = getUserLocally();
  const [status, setStatus] = useState('processing');
  const [fragmentNum, setFragmentNum] = useState(null);

  const TOTAL_FRAGMENTS = 16;

  useEffect(() => {
    if (!user) {
      if (rawId) {
        localStorage.setItem('pending_scan', rawId);
        navigate('/login');
      } else {
        setStatus('waiting');
      }
      return;
    }

    if (!rawId) {
      setStatus('waiting');
      return;
    }
    
    let parsedNum = rawId.toString().replace('fragment_', '');
    parsedNum = parseInt(parsedNum, 10);
    
    if (isNaN(parsedNum) || parsedNum < 1 || parsedNum > TOTAL_FRAGMENTS) {
      setStatus('error');
      return;
    }
    
    setFragmentNum(parsedNum);

    const processScan = async () => {
      const res = await apiCall('scan', { fragmentId: parsedNum });
      if (res && res.success) {
        setStatus('new');
      } else {
        setStatus('error');
      }
    };

    processScan();
  }, [rawId, navigate, user]);

  const renderContent = () => {
    if (status === 'waiting') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="cinzel" style={{ color: 'var(--accent-blue)' }}>Scanner Ready</h2>
          <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>Use your phone's camera to scan event QRs!</p>
          <GlowingButton onClick={() => navigate('/dashboard')} variant="secondary">Go to Dashboard</GlowingButton>
        </motion.div>
      );
    }
    
    if (status === 'processing') {
      return (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <div style={{ width: '50px', height: '50px', border: '3px solid var(--accent-blue)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </motion.div>
      );
    }

    if (status === 'new') {
      return (
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="glass-panel" style={{ padding: '40px' }}>
          <h1 className="cinzel" style={{ color: 'var(--accent-blue)', textShadow: 'var(--glow-shadow)', marginBottom: '20px' }}>⚡ Database Synced</h1>
          <p style={{ color: 'var(--text-primary)', marginBottom: '30px' }}>Fragment {fragmentNum} has been securely recorded to your Google Sheet profile!</p>
          <GlowingButton onClick={() => navigate('/dashboard')}>Return to Relic</GlowingButton>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 style={{ color: '#ff4444' }}>Scanner Error</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>Failed to verify with Google Sheets, or invalid code.</p>
        <GlowingButton onClick={() => navigate('/dashboard')} variant="secondary">Exit</GlowingButton>
      </motion.div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', padding: '20px', textAlign: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      {status === 'waiting' && <BottomNav />}
    </div>
  );
}
