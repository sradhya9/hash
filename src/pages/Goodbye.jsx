import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowingButton from '../components/GlowingButton';
import { LayoutGrid } from 'lucide-react';

export default function Goodbye() {
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
      color: 'var(--text-primary)'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ maxWidth: '400px' }}
      >
        <div style={{ fontSize: '4rem', color: '#B8860B', marginBottom: '30px' }}></div>
        <h1 className="cinzel" style={{ fontSize: '2.5rem', color: '#B8860B', marginBottom: '20px', textShadow: '0 0 20px rgba(218, 170, 50, 0.5)' }}>
          Ties Severed
        </h1>

        <div className="glass-panel" style={{ padding: '30px', background: 'rgba(20, 10, 5, 0.6)', border: '1px solid rgba(184, 134, 11, 0.3)' }}>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', fontStyle: 'italic', color: '#f0e6c8' }}>
            "Thou hast severed ties from the Gods. Thou art no longer a part of the adventure anymore."
          </p>
        </div>

        <p style={{ marginTop: '40px', color: 'rgba(162, 151, 30, 0.24)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          Thy thread of fate has been cut
        </p>

        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
          <GlowingButton
            onClick={() => navigate('/login')}
            variant="cream"
            style={{ borderRadius: '80px', padding: '12px 20px', maxWidth: '280px', background: '#FFF8DC', border: '1px solid #B8860B', boxShadow: '0 4px 20px rgba(184, 134, 11, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#FFF8DC', color: '#5a4e0fff', fontWeight: 'bold' }}>
              <LayoutGrid size={22} strokeWidth={1.5} />
              <span>Begin A New Thread</span>
            </div>
          </GlowingButton>
        </div>
      </motion.div>
    </div>
  );
}
