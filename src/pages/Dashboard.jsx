import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FragmentGrid from '../components/FragmentGrid';
import BottomNav from '../components/BottomNav';
import GlowingButton from '../components/GlowingButton';
import { getUserLocally, logoutLocally, apiCall } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUserLocally();
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(true);
  const TOTAL_FRAGMENTS = 16;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProgress = async () => {
      const res = await apiCall('scan');
      if (res && res.success) {
        const formatted = res.fragments.map(num => `fragment_${num}`);
        setFragments(formatted);
      }
      setLoading(false);
    };

    fetchProgress();
  }, [navigate]);

  const handleLogout = () => {
    logoutLocally();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', minHeight: '100dvh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '10px' }}>
        <div>
          <h2 className="cinzel" style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>Relic</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Welcome, {user.name}</p>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: '20px', cursor: 'pointer' }}>Disconnect</button>
      </div>

      <motion.div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>Database Sync</span>
          <span style={{ color: 'var(--accent-blue)' }}>{loading ? 'Fetching Sheet...' : `${fragments.length} / ${TOTAL_FRAGMENTS}`}</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(fragments.length / TOTAL_FRAGMENTS) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))' }}
          />
        </div>
      </motion.div>

      <FragmentGrid collectedFragments={fragments} total={TOTAL_FRAGMENTS} />

      {fragments.length === TOTAL_FRAGMENTS && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', marginTop: '30px' }}>
          <GlowingButton onClick={() => navigate('/reward')} variant="gold">Claim Divine Reward</GlowingButton>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
