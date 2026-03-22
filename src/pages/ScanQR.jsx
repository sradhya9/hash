import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import GlowingButton from '../components/GlowingButton';

export default function ScanQR() {
  const [searchParams] = useSearchParams();
  const fragmentId = searchParams.get('id');
  const { unlockFragment, loading: gameLoading } = useGame();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState('processing');

  useEffect(() => {
    if (!currentUser) {
      setStatus('unauth');
      return;
    }

    if (gameLoading) return;

    if (!fragmentId) {
      setStatus('error');
      return;
    }

    const processScan = async () => {
      const res = await unlockFragment(fragmentId);
      setStatus(res.status); // 'new', 'duplicate', 'error'
    };

    processScan();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, fragmentId, gameLoading]);

  const renderContent = () => {
    if (status === 'unauth') {
      return (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <h2 className="cinzel" style={{ color: 'var(--accent-gold)' }}>Authentication Required</h2>
          <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>You must be a sworn warrior to collect this logic.</p>
          <GlowingButton onClick={() => navigate('/login')}>Login to Claim</GlowingButton>
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
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <div className="glass-panel" style={{ padding: '40px', background: 'rgba(0, 229, 255, 0.1)', boxShadow: '0 0 50px rgba(0, 229, 255, 0.4)' }}>
            <h1 className="cinzel" style={{ color: 'var(--accent-blue)', textShadow: 'var(--glow-shadow)', marginBottom: '20px' }}>⚡ Fragment Acquired</h1>
            <p style={{ color: 'var(--text-primary)', marginBottom: '30px' }}>The power of {fragmentId.replace('_', ' ').toUpperCase()} flows through you.</p>
            <GlowingButton onClick={() => navigate('/dashboard')}>Return to Relic</GlowingButton>
          </div>
        </motion.div>
      );
    }

    if (status === 'duplicate') {
       return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="cinzel" style={{ color: 'var(--text-secondary)' }}>Already Possessed</h2>
          <p style={{ margin: '20px 0' }}>You already hold this fragment's power.</p>
          <GlowingButton onClick={() => navigate('/dashboard')} variant="secondary">Back</GlowingButton>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 style={{ color: '#ff4444' }}>Invalid Fragment Code</h2>
        <GlowingButton onClick={() => navigate('/dashboard')} variant="secondary" className="mt-4" style={{ marginTop: '20px' }}>Return</GlowingButton>
      </motion.div>
    );
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100dvh', padding: '20px', textAlign: 'center'
    }}>
      <AnimatePresence mode="wait">
        <motion.div key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
