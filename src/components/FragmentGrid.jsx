import React from 'react';
import { motion } from 'framer-motion';

export default function FragmentGrid({ collectedFragments, total = 16 }) {
  const fragments = Array.from({ length: total }, (_, i) => `fragment_${i + 1}`);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      margin: '20px 0',
      perspective: '1000px'
    }}>
      {fragments.map((fragId, index) => {
        const isCollected = collectedFragments.includes(fragId);

        return (
          <motion.div
            key={fragId}
            initial={false}
            animate={{ rotateY: isCollected ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            style={{
              width: '100%',
              aspectRatio: '1/1',
              position: 'relative',
              transformStyle: 'preserve-3d',
              cursor: 'pointer'
            }}
          >
            {/* Front (Locked) */}
            <div className="glass-panel" style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              fontWeight: 'bold',
              border: '1px dashed var(--glass-border)'
            }}>
              {index + 1}
            </div>

            {/* Back (Unlocked) */}
            <div className="glass-panel" style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(176, 38, 255, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--accent-blue)',
              boxShadow: 'var(--glow-shadow)',
              color: 'var(--accent-gold)'
            }}>
              <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${fragId}&backgroundColor=transparent`} alt="Fragment" style={{ width: '80%', height: '80%' , filter: 'drop-shadow(0 0 5px var(--accent-blue))'}} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
