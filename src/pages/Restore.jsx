import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowingButton from '../components/GlowingButton';
import BottomNav from '../components/BottomNav';

export default function Restore() {
  const [analyzing, setAnalyzing] = useState(false);
  const [collectedPieces, setCollectedPieces] = useState([]);
  const navigate = useNavigate();
  const TOTAL_FRAGMENTS = 16;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setAnalyzing(true);
    
    setTimeout(() => {
      const fileNames = files.map(f => f.name.toLowerCase());
      const detected = new Set();
      
      fileNames.forEach(name => {
        for (let i = 1; i <= TOTAL_FRAGMENTS; i++) {
          if (name.includes(`hash_fragment_${i}`)) {
            detected.add(i);
          }
        }
      });
      
      setCollectedPieces(Array.from(detected));
      setAnalyzing(false);
    }, 1500);
  };

  const handleAscend = () => {
    navigate('/reward');
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginTop: '20px', textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="cinzel" style={{ fontSize: '1.8rem', color: 'var(--accent-gold)' }}>Portal of Apotheosis</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontStyle: 'italic' }}>Offer thy collected shards to the eternal flame to restore the relic.</p>
      </div>

      <motion.div className="glass-panel" style={{ padding: '30px', width: '100%', maxWidth: '350px', textAlign: 'center' }}>
        
        {analyzing ? (
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ margin: '0 auto', width: '50px', height: '50px', border: '3px solid var(--accent-gold)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        ) : (
          <>
            <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: '100%' }}>
              <GlowingButton variant="secondary">Present the Shards</GlowingButton>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileUpload}
                style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
              />
            </div>
            {collectedPieces.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '15px', fontStyle: 'italic' }}>
                Thou must possess all 16 divine shards to proceed.
              </p>
            )}
          </>
        )}

        {collectedPieces.length > 0 && !analyzing && (
           <div style={{ marginTop: '30px' }}>
             <h3 className="cinzel" style={{ color: 'var(--accent-gold)' }}>Presence Confirmed</h3>
             <h1 style={{ fontSize: '3.5rem', margin: '10px 0', color: collectedPieces.length === TOTAL_FRAGMENTS ? 'var(--accent-gold)' : 'var(--text-primary)', fontFamily: 'Cinzel' }}>
               {collectedPieces.length} / {TOTAL_FRAGMENTS}
             </h1>
             
              {collectedPieces.length === TOTAL_FRAGMENTS ? (
                <GlowingButton onClick={handleAscend} variant="gold" style={{ marginTop: '20px' }}>Commence Apotheosis</GlowingButton>
              ) : (
                <p style={{ color: '#B22222', fontSize: '0.9rem', marginTop: '10px', fontStyle: 'italic' }}>Thou lackest the required power. Return when all 16 shards are gathered.</p>
              )}
           </div>
        )}
      </motion.div>

      <BottomNav />
    </div>
  );
}
