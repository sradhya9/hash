import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowingButton from '../components/GlowingButton';
import BottomNav from '../components/BottomNav';

export default function Reward() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', textAlign: 'center', padding: '40px 20px 120px 20px',
      background: 'radial-gradient(circle at center, rgba(255,215,0,0.2) 0%, var(--bg-color) 70%)',
      position: 'relative', overflow: 'auto'
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
          backgroundImage: 'url("/hash_logo_complete.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 0 100px var(--accent-gold)',
          border: '4px solid var(--accent-gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '40px', zIndex: 1
        }}
      />

      <motion.h1 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
        className="cinzel" style={{ color: 'var(--accent-gold)', textShadow: 'var(--gold-glow)', marginBottom: '20px', fontSize: '2rem', zIndex: 1 }}
      >
        Ascension Complete
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        style={{ zIndex: 1 }}
      >
        <h1 className="cinzel" style={{ fontSize: '2.5rem', color: 'var(--accent-gold)', marginBottom: '15px' }}>Divine Favor Received</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6', fontStyle: 'italic' }}>
          The Gods have witnessed thy journey. The relic is restored, and thy name is eternalized in Olympus.
        </p>
        <p style={{ color: 'var(--text-primary)', marginBottom: '40px', lineHeight: '1.6' }}>
          Show this screen to the Game Master to claim your reward.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} style={{ zIndex: 1, width: '100%', paddingBottom: '80px' }}>
         <p style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>Thy journey is honored.</p>
      </motion.div>
      <BottomNav />
    </div>
  );
}
