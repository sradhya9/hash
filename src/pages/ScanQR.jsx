import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlowingButton from '../components/GlowingButton';
import BottomNav from '../components/BottomNav';
import { getUserLocally, apiCall } from '../services/api';
import { LayoutGrid } from 'lucide-react';

const MYTHIC_SHARDS = {
  1: { god: "Zeus", name: "Sky Shard", desc: "The thunderous power of the King of Gods now resides within thy reliquary." },
  2: { god: "Hera", name: "Majesty Shard", desc: "The regal essence of the Queen of Olympus protects thy journey." },
  3: { god: "Poseidon", name: "Abyss Shard", desc: "The churning depths of the Great Sea yield their secrets to thy vision." },
  4: { god: "Demeter", name: "Harvest Shard", desc: "The eternal cycle of growth and life sustains thy noble odyssey." },
  5: { god: "Athena", name: "Aegis Shard", desc: "Divine wisdom and strategic brilliance guide thy hand and mind." },
  6: { god: "Apollo", name: "Radiance Shard", desc: "The music of the spheres and the sun's pure light shine upon thee." },
  7: { god: "Artemis", name: "Lunar Shard", desc: "The silver huntress marks thy path through the wild unknown." },
  8: { god: "Ares", name: "Iron Shard", desc: "The unyielding strength of the forge of war empowers thy spirit." },
  9: { god: "Aphrodite", name: "Grace Shard", desc: "Eternal beauty and the bond of hearts weave favor into thy fate." },
  10: { god: "Hephaestus", name: "Ember Shard", desc: "The sacred fire of the master smith tempers thy soul for greatness." },
  11: { god: "Hermes", name: "Swift Shard", desc: "The messenger's speed carries thy name to the furthest reaches of the realm." },
  12: { god: "Hestia", name: "Flame Shard", desc: "The warmth of the eternal hearth welcomes the hero home." },
  13: { god: "Dionysus", name: "Nectar Shard", desc: "Divine revelry and the spirit of the vine celebrate thy discovery." },
  14: { god: "Hades", name: "Shadow Shard", desc: "The mysteries of the unseen realm pay homage to thy persistent quest." },
  15: { god: "Persephone", name: "Bloom Shard", desc: "The promise of spring and the hidden power of the earth awaken for thee." },
  16: { god: "Helios", name: "Sol Shard", desc: "The chariot of the sun illuminates the final truth of thy journey." }
};

const MYTHIC_BOX_STYLE = {
  position: 'relative',
  width: 'min(320px, 90vw)',
  height: 'min(320px, 90vw)',
  padding: '10px',
  border: '2px solid rgba(212, 175, 55, 0.8)',
  borderRadius: '20px',
  background: 'rgba(15, 10, 25, 0.9)',
  boxShadow: '0 0 40px rgba(0,0,0,1), 0 0 20px rgba(212, 175, 55, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

export default function ScanQR() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get('id');
  const navigate = useNavigate();
  const user = getUserLocally();
  const [status, setStatus] = useState('waiting');
  const [fragmentNum, setFragmentNum] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedText, setScannedText] = useState('');
  const scannerRef = useRef(null);

  const TOTAL_FRAGMENTS = 16;
  const userPhone = user?.phone;

  useEffect(() => {
    if (status === 'new' || status === 'error') return;

    if (!user) {
      if (rawId) {
        localStorage.setItem('pending_scan', rawId);
        navigate('/login');
      } else {
        setStatus('waiting');
      }
      return;
    }

    if (rawId) {
      handleDirectScan(rawId);
    } else {
      setStatus('waiting');
    }

    return () => {
      if (scannerRef.current && typeof scannerRef.current.clear === 'function') {
        scannerRef.current.clear().catch(() => { });
      }
      scannerRef.current = null;
    };
  }, [rawId, navigate, userPhone, status]);

  const handleDirectScan = async (id) => {
    let parsedNum = id?.toString()?.replace('fragment_', '');
    parsedNum = parseInt(parsedNum, 10);

    if (isNaN(parsedNum) || parsedNum < 1 || parsedNum > TOTAL_FRAGMENTS) {
      setStatus('error');
      setErrorMessage('The symbol carries no divine power.');
      return;
    }

    setFragmentNum(parsedNum);
    setStatus('processing');

    try {
      const res = await apiCall('scan', { fragmentId: parsedNum });
      if (res?.success) {
        setStatus('new');
      } else {
        setStatus('error');
        setErrorMessage(res?.error || 'The Oracle is silent.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('A distortion in the aether has occurred.');
    }
  };

  const startScanner = () => {
    // In-app scanner removed at user request.
    // Users should use native phone scanner.
    setStatus('waiting');
  };

  const stopScanner = () => {
    setStatus('waiting');
  };

  const handleSaveFragment = () => {
    const shard = MYTHIC_SHARDS[fragmentNum];
    if (shard) {
      alert(`The ${shard.name} of ${shard.god} has been eternally recorded in thy device's memory.`);
    }
  };

  const renderContent = () => {
    if (status === 'waiting') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="cinzel" style={{ marginBottom: '15px', color: 'var(--accent-gold)' }}>Unlock the Mystery</h2>

          <div style={{
            ...MYTHIC_BOX_STYLE,
            padding: '40px 25px',
            textAlign: 'center',
            background: '#7e6c40ff',
            border: '2px solid rgba(212, 175, 55, 0.45)',
            boxShadow: '0 0 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(212,175,55,0.08)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '20px', color: 'var(--accent-gold)', textShadow: '0 0 15px rgba(212,175,55,0.3)' }}>◈</div>
            <p style={{ color: '#fff8e8', fontSize: '1.25rem', marginBottom: '25px', fontStyle: 'italic', lineHeight: '1.6', letterSpacing: '0.5px' }}>
              The Divine Eye resides in thy own device.
            </p>
            <p style={{ color: '#f0e6c8', fontSize: '1.05rem', lineHeight: '1.7', opacity: 0.9 }}>
              Please use thy phone's native camera or any QR scanner app to scan the sacred runes and unveil the vision.
            </p>
          </div>

          <p style={{ marginTop: '30px', color: 'rgba(240,230,200,0.4)', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', fontStyle: 'italic' }}>
            The Odyssey awaits thy capture
          </p>

        </motion.div>
      );
    }

    if (status === 'scanning') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            width: '100%',
            maxWidth: '380px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h2 className="cinzel" style={{ marginBottom: '12px', color: 'var(--accent-gold)' }}>
            SCAN THE RUNE
          </h2>

          <p style={{
            marginBottom: '24px',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            opacity: 0.85,
            fontStyle: 'italic',
            textAlign: 'center',
            maxWidth: '320px'
          }}>
            Align the <strong>HASH QR code</strong> within the frame to bind its power.
          </p>

          <div style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            border: '2px solid rgba(212, 175, 55, 0.65)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(10, 6, 20, 0.92)',
            boxShadow: '0 0 40px rgba(0,0,0,0.9), inset 0 0 50px rgba(0,0,0,0.7), 0 0 20px rgba(212,175,55,0.28)'
          }}>
            <div id="reader" style={{ width: '100%', height: '100%' }} />

            {/* Golden L-shaped corners */}
            <div style={{
              position: 'absolute',
              inset: '-12px',
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '80px', height: '80px', borderTop: '10px solid #e8d5a3', borderLeft: '10px solid #e8d5a3', borderTopLeftRadius: '20px' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderTop: '10px solid #e8d5a3', borderRight: '10px solid #e8d5a3', borderTopRightRadius: '20px' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '80px', height: '80px', borderBottom: '10px solid #e8d5a3', borderLeft: '10px solid #e8d5a3', borderBottomLeftRadius: '20px' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '80px', height: '80px', borderBottom: '10px solid #e8d5a3', borderRight: '10px solid #e8d5a3', borderBottomRightRadius: '20px' }} />
            </div>

            <button
              onClick={stopScanner}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to bottom, rgba(25,18,38,0.92), rgba(15,10,25,0.98))',
                border: 'none',
                borderTop: '1px solid rgba(212,175,55,0.35)',
                color: '#f0e6c8',
                padding: '14px 0',
                fontSize: '0.96rem',
                fontWeight: '500',
                cursor: 'pointer',
                zIndex: 20,
                backdropFilter: 'blur(4px)'
              }}
            >
              Stop Scanning
            </button>
          </div>

          <p style={{
            marginTop: '24px',
            color: 'rgba(240,230,200,0.65)',
            fontSize: '0.88rem',
            fontStyle: 'italic'
          }}>
            The divine eye awaits the sacred alignment...
          </p>
        </motion.div>
      );
    }

    if (status === 'processing') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
          <h2 className="cinzel" style={{ marginBottom: '10px', color: 'var(--accent-gold)' }}>Consulting the Oracle</h2>
          <p style={{ marginBottom: '30px', color: 'var(--text-secondary)', fontSize: '0.9rem', opacity: 0.8 }}>The Fates are weaving thy discovery into the tapestry...</p>

          <div style={{ ...MYTHIC_BOX_STYLE, background: 'rgba(20, 20, 20, 0.6)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <div style={{ width: '80px', height: '80px', border: '5px solid var(--accent-gold)', borderTopColor: 'transparent', borderRadius: '50%', boxShadow: '0 0 25px rgba(184, 134, 11, 0.5)' }} />
            </motion.div>

            {scannedText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  wordBreak: 'break-all',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.65rem', color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.7, letterSpacing: '1px' }}>Captured Essence</div>
                <code style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{scannedText}</code>
              </motion.div>
            )}
          </div>

          {scannedText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: '20px',
                padding: '8px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ color: 'var(--accent-gold)' }}>●</span>
              {scannedText}
            </motion.div>
          )}
        </div>
      );
    }

    if (status === 'new') {
      const shard = MYTHIC_SHARDS[fragmentNum] || { god: "Unknown", name: "Ancient Shard", desc: "A fragment of lost power has been found." };
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="glass-panel"
          style={{ padding: '30px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', trackingWidest: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Vision Discovered</div>
          <h1 className="cinzel" style={{ color: 'var(--text-primary)', fontSize: '2.5rem', marginBottom: '25px', textShadow: 'var(--gold-glow)' }}>{shard.god}</h1>

          <div style={{ ...MYTHIC_BOX_STYLE, background: 'rgba(10, 5, 15, 0.95)', height: 'auto', minHeight: '320px', padding: '30px', boxShadow: '0 0 50px rgba(0,0,0,1), 0 0 30px rgba(212, 175, 55, 0.4)' }}>
            <div style={{
              width: '180px', height: '180px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              border: '2px solid var(--accent-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '25px', boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
              position: 'relative'
            }}>
              <div className="shimmer" style={{ fontSize: '4rem' }}>✧</div>
              <div style={{ position: 'absolute', top: -10, left: -10, width: 30, height: 30, borderTop: '3px solid white', borderLeft: '3px solid white', zIndex: 5 }} />
              <div style={{ position: 'absolute', top: -10, right: -10, width: 30, height: 30, borderTop: '3px solid white', borderRight: '3px solid white', zIndex: 5 }} />
              <div style={{ position: 'absolute', bottom: -10, left: -10, width: 30, height: 30, borderBottom: '3px solid white', borderLeft: '3px solid white', zIndex: 5 }} />
              <div style={{ position: 'absolute', bottom: -10, right: -10, width: 30, height: 30, borderBottom: '3px solid white', borderRight: '3px solid white', zIndex: 5 }} />

              <div style={{
                position: 'absolute', bottom: '-12px', background: 'var(--bg-color)',
                border: '1px solid var(--accent-gold)', padding: '5px 15px',
                borderRadius: '20px', fontSize: '0.7rem', color: 'var(--accent-gold)',
                fontWeight: 'bold', textTransform: 'uppercase', trackingWidest: '1px'
              }}>
                {shard.name}
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontStyle: 'italic', fontSize: '1rem', lineHeight: '1.6' }}>
              "{shard.desc}"
            </p>

            <div style={{
              padding: '8px 15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ color: 'var(--accent-gold)' }}>●</span>
              {scannedText || "Unknown Rune"}
            </div>
          </div>

          <div style={{ width: '100%', gap: '15px', display: 'flex', flexDirection: 'column', marginTop: '25px' }}>
            <GlowingButton onClick={handleSaveFragment}>
              Save to Reliquary
            </GlowingButton>
            <GlowingButton onClick={() => navigate('/dashboard')} variant="secondary">
              View Pantheon
            </GlowingButton>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="cinzel" style={{ color: '#B22222' }}>Vision Obscured</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{errorMessage || 'The Fates have hidden this shard.'}</p>
        <GlowingButton onClick={() => setStatus('waiting')} variant="secondary">Try Again</GlowingButton>
      </motion.div>
    );
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      minHeight: '100dvh', 
      padding: '40px 20px 120px 20px', 
      textAlign: 'center', 
      position: 'relative',
      overflow: 'auto'
    }}>
      <AnimatePresence>
        <motion.div key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      {(status === 'waiting' || status === 'error') && <BottomNav />}
    </div>
  );
}