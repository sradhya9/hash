import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import GlowingButton from '../components/GlowingButton';
import BottomNav from '../components/BottomNav';

export default function Admin() {
  const { currentUser } = useAuth();
  const { TOTAL_FRAGMENTS, unlockFragment, clearProgress } = useGame();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', paddingTop: '100px' }}>
        <h2>Login required for Admin Panel</h2>
        <GlowingButton onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>Go to Login</GlowingButton>
      </div>
    );
  }

  const fragments = Array.from({ length: TOTAL_FRAGMENTS }, (_, i) => `fragment_${i + 1}`);

  const testUnlock = async (id) => {
    navigate(`/scan?id=${id}`);
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', minHeight: '100dvh' }}>
      <h2 className="cinzel" style={{ color: 'var(--accent-purple)', textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>Admin / Test Panel</h2>
      
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>Simulate Scan</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          Clicking a button simulates scanning a QR code for that specific fragment.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {fragments.map((id, index) => (
            <button
              key={id}
              onClick={() => testUnlock(id)}
              style={{
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              #{index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '15px', color: '#ff4444' }}>Danger Zone</h3>
        <GlowingButton onClick={() => { if(window.confirm('Clear all progress?')) clearProgress(); }} variant="secondary" style={{ borderColor: '#ff4444', color: '#ff4444' }}>
          Reset Collection
        </GlowingButton>
      </div>

      <BottomNav />
    </div>
  );
}
