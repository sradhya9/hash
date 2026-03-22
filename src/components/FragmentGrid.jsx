import React from 'react';
import { motion } from 'framer-motion';

export default function FragmentGrid({ collectedFragments, total = 16 }) {
  const fragments = Array.from({ length: total }, (_, i) => `fragment_${i + 1}`);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'clamp(5px, 2vw, 10px)',
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
              fontSize: '0.8rem',
              fontWeight: 'bold',
              fontFamily: 'Cinzel',
              border: '1px dashed var(--glass-border)',
              background: 'rgba(0,0,0,0.03)'
            }}>
              {index + 1}
            </div>

            {/* Back (Unlocked) - Puzzle Piece */}
            <div className="glass-panel" style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              backgroundImage: 'url("/hash_logo_complete.png")',
              backgroundSize: '400% 400%',
              backgroundPosition: `${(index % 4) * 33.33}% ${Math.floor(index / 4) * 33.33}%`,
              border: '1px solid var(--accent-gold)',
              boxShadow: 'var(--gold-glow)',
            }} />
          </motion.div>
        );
      })}
    </div>
  );
}
