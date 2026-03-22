import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, LayoutGrid } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isReliquary = location.pathname === '/dashboard';
  const isVision = location.pathname === '/scan';

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        background: '#FEF9E7',
        padding: '12px clamp(20px, 8vw, 45px)',
        borderRadius: '80px',
        gap: 'clamp(30px, 10vw, 60px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        pointerEvents: 'auto'
      }}>
        {/* Reliquary Item */}
        <div 
          onClick={() => navigate('/dashboard')}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            cursor: 'pointer',
            opacity: isReliquary ? 1 : 0.6,
            transition: 'all 0.3s ease',
            color: '#5D4037'
          }}
        >
          <LayoutGrid size={28} strokeWidth={1.5} />
          <span style={{ 
            fontSize: '0.9rem', 
            marginTop: '4px', 
            fontFamily: "'Inter', sans-serif",
            fontWeight: isReliquary ? '600' : '400'
          }}>Reliquary</span>
        </div>

        {/* Vision Item */}
        <div 
          onClick={() => navigate('/scan')}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            cursor: 'pointer',
            opacity: isVision ? 1 : 0.6,
            transition: 'all 0.3s ease',
            color: '#B8860B'
          }}
        >
          <Camera size={28} strokeWidth={1.5} />
          <span style={{ 
            fontSize: '0.9rem', 
            marginTop: '4px', 
            fontFamily: "'Inter', sans-serif",
            fontWeight: isVision ? '600' : '400'
          }}>Vision</span>
        </div>
      </div>
    </motion.div>
  );
}
