import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const navItems = [
    { path: '/dashboard', icon: <LayoutGrid size={24} />, label: 'Reliquary' },
    { path: '/scan', icon: <Camera size={24} />, label: 'Vision' }
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(360px, calc(100% - 40px))',
        display: 'flex',
        justifyContent: 'space-around', /* Symmetrical distribution */
        alignItems: 'center',
        padding: '15px 0',
        zIndex: 1000,
        borderRadius: '50px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1), var(--glow-shadow)',
        backdropFilter: 'blur(20px)',
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
            justifyContent: 'center',
            flex: 1, /* Equal width for both items */
            color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.8rem',
            gap: '6px',
            transition: 'all 0.3s ease'
          })}
        >
          {item.icon}
          <span style={{ fontFamily: 'Inter' }}>{item.label}</span>
        </NavLink>
      ))}
    </motion.div>
  );
}
