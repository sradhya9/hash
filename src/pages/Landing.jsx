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
      minHeight: '100dvh',
      padding: '40px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'auto'
    }}>
      {/* Background is now handled globally by GreekBackground in App.jsx */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ zIndex: 1 }}
      >
        <h1 className="cinzel" style={{
          fontSize: '3.5rem',
          color: 'var(--accent-gold)',
          textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
          marginBottom: '10px'
        }}>
          HASH
        </h1>
        <h2 style={{
          fontSize: '1.4rem',
          color: 'var(--text-primary)',
          marginBottom: '40px',
          fontWeight: 400,
          letterSpacing: '4px',
          textTransform: 'uppercase'
        }}>
          The Fragmented Odyssey
        </h2>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '50px', maxWidth: '300px', lineHeight: '1.7', fontStyle: 'italic' }}>
          Collect the 16 divine shards scattered across the mortal realm. Restore the relic of the Gods.
        </p>

        <GlowingButton onClick={() => navigate('/login')}>
          Embark on Odyssey
        </GlowingButton>
      </motion.div>
    </div>
  );
}
