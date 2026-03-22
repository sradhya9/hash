import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlowingButton from '../components/GlowingButton';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background is now handled globally by GreekBackground in App.jsx */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ zIndex: 1 }}
      >
        <h1 className="cinzel" style={{
          fontSize: '3rem',
          color: 'var(--accent-gold)',
          textShadow: 'var(--gold-glow)',
          marginBottom: '10px'
        }}>
          HASH
        </h1>
        <h2 style={{
          fontSize: '1.2rem',
          color: 'var(--text-primary)',
          marginBottom: '40px',
          fontWeight: 300,
          letterSpacing: '2px'
        }}>
          The Fragmented Odyssey
        </h2>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '50px', maxWidth: '300px', lineHeight: '1.6' }}>
          Collect the 16 fragments scattered across the realm. Restore the divine relic.
        </p>

        <GlowingButton onClick={() => navigate('/login')}>
          Begin Quest
        </GlowingButton>
      </motion.div>
    </div>
  );
}
