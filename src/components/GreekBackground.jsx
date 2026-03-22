import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const GREEK_SYMBOLS = ['Ω', 'Ψ', 'Δ', 'Σ', 'Φ', 'Θ', 'Λ', 'Ξ', '✧', '♦', '✦', 'π', '♅', 'ω', 'Ξ', '♆', 'α', 'β', 'ε', 'σ', 'Φ'];

export default function GreekBackground() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate random positions for the background symbols
    const generateElements = () => {
      const newElements = [];
      for (let i = 0; i < 20; i++) {
        newElements.push({
          id: i,
          symbol: GREEK_SYMBOLS[Math.floor(Math.random() * GREEK_SYMBOLS.length)],
          initialX: Math.random() * 100,
          initialY: Math.random() * 100,
          scale: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
          opacity: Math.random() * 0.15 + 0.05, // 0.05 to 0.20
          durationX: Math.random() * 20 + 20, // 20s to 40s
          durationY: Math.random() * 20 + 20, // 20s to 40s
          delayX: Math.random() * 5,
          delayY: Math.random() * 5,
          rotation: Math.random() * 360,
        });
      }
      setElements(newElements);
    };

    generateElements();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      pointerEvents: 'none', // Allow clicks to pass through
      zIndex: -1,
      background: 'var(--bg-gradient)',
    }}>
      {/* Subtle mystical grid / marble veins could go here, for now it's just the gradient and radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '150vw',
        height: '150vh',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.05) 0%, rgba(11, 15, 26, 0) 70%)',
      }} />

      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{
            x: `${el.initialX}vw`,
            y: `${el.initialY}vh`,
            rotate: el.rotation,
            scale: el.scale,
            opacity: el.opacity,
          }}
          animate={{
            x: [`${el.initialX}vw`, `${(el.initialX + 20) % 100}vw`, `${(el.initialX - 20) % 100}vw`, `${el.initialX}vw`],
            y: [`${el.initialY}vh`, `${(el.initialY - 30) % 100}vh`, `${(el.initialY + 30) % 100}vh`, `${el.initialY}vh`],
            rotate: [el.rotation, el.rotation + 180, el.rotation + 360],
            opacity: [el.opacity, el.opacity * 1.5, el.opacity],
          }}
          transition={{
            x: { duration: el.durationX, repeat: Infinity, ease: 'linear', delay: el.delayX },
            y: { duration: el.durationY, repeat: Infinity, ease: 'linear', delay: el.delayY },
            rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
          }}
          style={{
            position: 'absolute',
            color: 'var(--accent-gold)',
            fontSize: '3.5rem',
            fontFamily: 'Cinzel, serif',
            textShadow: '0 0 10px rgba(184, 134, 11, 0.3)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        >
          {el.symbol}
        </motion.div>
      ))}
    </div>
  );
}
