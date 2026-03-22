import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import FragmentGrid from '../components/FragmentGrid';
import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { fragments, completed, TOTAL_FRAGMENTS } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', minHeight: '100dvh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '10px' }}>
        <div>
          <h2 className="cinzel" style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>Odyssey</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Welcome, {currentUser.displayName || 'Warrior'}</p>
        </div>
        <button onClick={logout} style={{
          background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)',
          padding: '8px 12px', borderRadius: '20px', cursor: 'pointer'
        }}>
          Evacuate
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel" 
        style={{ padding: '20px', marginBottom: '30px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>Restoration</span>
          <span style={{ color: 'var(--accent-blue)' }}>{fragments.length} / {TOTAL_FRAGMENTS}</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(fragments.length / TOTAL_FRAGMENTS) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))', boxShadow: 'var(--glow-shadow)' }}
          />
        </div>
      </motion.div>

      <FragmentGrid collectedFragments={fragments} total={TOTAL_FRAGMENTS} />

      {completed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', marginTop: '30px' }}
        >
          <button 
            onClick={() => navigate('/reward')}
            className="cinzel"
            style={{
              padding: '15px 30px', background: 'var(--accent-gold)', color: '#000', 
              border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.2rem',
              boxShadow: 'var(--gold-glow)', cursor: 'pointer'
            }}
          >
            Claim Divine Reward
          </button>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
