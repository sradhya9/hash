import React from 'react';
import { motion } from 'framer-motion';

export default function GlowingButton({ children, onClick, variant = 'primary', className = '', ...props }) {
  const getStyle = () => {
    switch (variant) {
      case 'gold':
        return {
          background: 'rgba(212, 175, 55, 0.1)',
          color: 'var(--accent-gold)',
          border: '2px solid var(--accent-gold)',
          boxShadow: 'var(--gold-glow)',
          fontFamily: 'Cinzel, serif',
          letterSpacing: '2px'
        };
      case 'secondary':
        return {
          background: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--glass-border)',
          fontFamily: 'Cinzel, serif'
        };
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, rgba(10, 110, 189, 0.2), rgba(74, 20, 140, 0.2))',
          color: 'var(--accent-gold)',
          border: '1px solid var(--accent-gold)',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          boxShadow: 'var(--glow-shadow)',
          fontFamily: 'Cinzel, serif',
          letterSpacing: '1px'
        };
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212, 175, 55, 0.6)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: '16px 32px',
        borderRadius: '30px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        margin: '10px 0',
        ...getStyle()
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
