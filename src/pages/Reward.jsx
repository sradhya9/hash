import React, { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowingButton from '../components/GlowingButton';

export default function Reward() {
  const { completed } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!completed) {
      navigate('/dashboard');
    }
  }, [completed, navigate]);

  if (!completed) return null;

  return (
    <div style={{
      height: '100dvh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px',
      background: 'radial-gradient(circle at center, rgba(255,215,0,0.2) 0%, var(--bg-color) 70%)',
      position: 'relative', overflow: 'hidden'
    }}>
      
      {/* Light Burst */}
      <motion.div 
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 10, opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          position: 'absolute', width: '100px', height: '100px', borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
          zIndex: 0
        }}
      />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 50, duration: 2, delay: 0.5 }}
        style={{
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'linear-gradient(45deg, var(--accent-gold), var(--accent-purple))',
          boxShadow: '0 0 100px var(--accent-gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '40px', zIndex: 1
        }}
      >
        <span className="cinzel" style={{ fontSize: '4rem', color: '#000' }}>H</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
        className="cinzel" style={{ color: 'var(--accent-gold)', textShadow: 'var(--gold-glow)', marginBottom: '20px', fontSize: '2rem', zIndex: 1 }}
      >
        Ascension Complete
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        style={{ color: 'var(--text-primary)', marginBottom: '40px', lineHeight: '1.6', zIndex: 1 }}
      >
        You have restored the divine seal of HASH.<br/>
        Show this screen to the Game Master to claim your reward.
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} style={{ zIndex: 1, width: '100%' }}>
        <GlowingButton onClick={() => navigate('/dashboard')} variant="secondary">
          Return to Dashboard
        </GlowingButton>
      </motion.div>
    </div>
  );
}
