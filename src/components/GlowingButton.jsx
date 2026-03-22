import React from 'react';
import { motion } from 'framer-motion';

export default function GlowingButton({ children, onClick, variant = 'primary', className = '', ...props }) {
  const getStyle = () => {
    switch (variant) {
      case 'gold':
      case 'reliquary':
      case 'vision':
        return {
          background: 'linear-gradient(135deg, #5a4e0fff 0%, #B8860B 100%)',
          color: '#1a1a1a',
          border: '1px solid #FFF8DC',
          boxShadow: '0 4px 20px rgba(184, 134, 11, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)',
          fontFamily: 'Cinzel, serif',
          letterSpacing: '2px',
          fontWeight: '900'
        };
      case 'cream':
        return {
          background: '#FEF9E7',
          color: '#B8860B',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          fontFamily: 'Cinzel, serif',
          fontWeight: '700'
        };
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.15)',
          color: 'var(--text-primary)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(5px)',
          fontFamily: 'Cinzel, serif'
        };
      case 'primary':
      default:
        return {
          background: 'var(--accent-gold)',
          color: '#FDF5E6',
          border: '1px solid #FFF8DC',
          boxShadow: 'var(--glow-shadow)',
          fontFamily: 'Cinzel, serif'
        };
    }
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '1rem',
        textTransform: 'uppercase',
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.3s ease',
        ...getStyle()
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
