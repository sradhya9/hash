import React from 'react';
import { motion } from 'framer-motion';

export default function GlowingButton({ children, onClick, variant = 'primary', className = '', ...props }) {
  const getStyle = () => {
    switch (variant) {
      case 'gold':
        return {
          background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
          color: '#FDF5E6',
          border: 'none',
          boxShadow: '0 4px 15px rgba(184, 134, 11, 0.4)',
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
          background: 'rgba(255, 255, 255, 0.8)',
          color: 'var(--accent-gold)',
          border: '2px solid var(--accent-gold)',
          textShadow: '0 1px 2px rgba(255,255,255,0.5)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
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
