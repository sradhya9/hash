import React from 'react';
import { motion } from 'framer-motion';

export default function GlowingButton({ children, onClick, variant = 'primary', className = '', ...props }) {
  const getStyle = () => {
    switch (variant) {
      case 'gold':
        return {
          background: 'transparent',
          color: 'var(--accent-gold)',
          border: '1px solid var(--accent-gold)',
          boxShadow: 'var(--gold-glow)'
        };
      case 'secondary':
        return {
          background: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--glass-border)',
        };
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          color: 'var(--text-primary)',
          border: 'none',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          boxShadow: 'var(--glow-shadow)'
        };
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
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
