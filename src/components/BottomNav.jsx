import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const navItems = [
    { path: '/scan', icon: <Camera size={24} />, label: 'Scanner' },
    { path: '/restore', icon: <UploadCloud size={24} />, label: 'Restoration Portal' }
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '390px',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        zIndex: 1000,
        borderRadius: '30px',
      }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.75rem',
            gap: '4px'
          })}
        >
          {item.icon}
          <span style={{ fontFamily: 'Inter' }}>{item.label}</span>
        </NavLink>
      ))}
    </motion.div>
  );
}
