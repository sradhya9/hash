import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlowingButton from '../components/GlowingButton';
import BottomNav from '../components/BottomNav';
import { getUserLocally, apiCall } from '../services/api';

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

export default function ScanQR() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get('id');
  const navigate = useNavigate();
  const user = getUserLocally();
  const [status, setStatus] = useState('processing'); // processing, waiting, scanning, new, error
  const [fragmentNum, setFragmentNum] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const scannerRef = useRef(null);
  const html5QrCode = useRef(null);

  const TOTAL_FRAGMENTS = 16;

  useEffect(() => {
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
      stopScanner();
    };
  }, [rawId, navigate, user]);

  const handleDirectScan = async (id) => {
    let parsedNum = id.toString().replace('fragment_', '');
    parsedNum = parseInt(parsedNum, 10);
    
    if (isNaN(parsedNum) || parsedNum < 1 || parsedNum > TOTAL_FRAGMENTS) {
      setStatus('error');
      setErrorMessage('The symbol carries no divine power.');
      return;
    }
    
    setFragmentNum(parsedNum);
    setStatus('processing');

    const res = await apiCall('scan', { fragmentId: parsedNum });
    if (res && res.success) {
      setStatus('new');
    } else {
      setStatus('error');
      setErrorMessage(res?.error || 'The Oracle is silent.');
    }
  };



  const startScanner = async () => {
    if (!window.Html5Qrcode) {
      setErrorMessage("The Oracle's knowledge is still loading. Please refresh.");
      setStatus('error');
      return;
    }

    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setErrorMessage("The Divine Eye requires a secure connection (HTTPS) to witness the runes on mobile.");
      setStatus('error');
      return;
    }

    setStatus('scanning');
    
    // Use a robust retry loop to find the element after the React render
    try {
      // 1. Explicitly request permissions / check for cameras
      const cameras = await window.Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        throw new Error("No divine eyes (cameras) found on this device.");
      }

      setStatus('scanning');
      
      // 2. Use a robust retry loop to find the element after the React render
      let element = null;
      for (let i = 0; i < 50; i++) { // Increased to 5 seconds for slower devices/animations
        element = document.getElementById('reader');
        if (element) break;
        await new Promise(r => setTimeout(r, 100));
      }
      
      if (!element) throw new Error("Divine frame not found.");

      if (!html5QrCode.current) {
        html5QrCode.current = new window.Html5Qrcode("reader");
      }
        
        const config = { 
          fps: 15, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };
        
        await html5QrCode.current.start(
          { facingMode: "environment" }, 
          config,
          (decodedText) => {
            let id = decodedText;
            if (decodedText.includes('?id=')) {
              try {
                const url = new URL(decodedText);
                id = url.searchParams.get('id');
              } catch (e) { /* ignore */ }
            }
            stopScanner();
            handleDirectScan(id);
          },
          () => {} // Silent on scan failure
        );
    } catch (err) {
      console.error("Camera Error:", err);
      setStatus('error');
      if (err.message?.includes("Permission") || err.name?.includes("NotAllowed")) {
        setErrorMessage("Thou hast denied the Divine Eye access. Grant permissions in thy settings.");
      } else {
        setErrorMessage(err.message || "The Vision is obscured. Ensure thy camera is available and permissions are granted.");
      }
    }
  };

  const stopScanner = async () => {
    if (html5QrCode.current && html5QrCode.current.isScanning) {
      try {
        await html5QrCode.current.stop();
        // Do not clear the ref, so we can reuse it
      } catch (e) {
        console.error("Stop Error", e);
      }
    }
  };

  const handleSaveFragment = () => {
    const shard = MYTHIC_SHARDS[fragmentNum];
    alert(`The ${shard.name} of ${shard.god} has been eternally recorded in thy device's memory.`);
  };

  const renderContent = () => {
    if (status === 'waiting') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="cinzel" style={{ marginBottom: '10px', color: 'var(--accent-gold)' }}>Scan the Rune</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem', fontStyle: 'italic', maxWidth: '300px', lineHeight: '1.6' }}>
            Align the HASH QR code within the frame to bind its power.
          </p>
          
          <GlowingButton onClick={startScanner} style={{ marginBottom: '15px' }}>
            Invoke the Divine Eye
          </GlowingButton>

          <GlowingButton onClick={() => navigate('/dashboard')} variant="secondary">
            Return to Reliquary
          </GlowingButton>
        </motion.div>
      );
    }

    if (status === 'scanning') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="cinzel" style={{ marginBottom: '20px', color: 'var(--accent-gold)' }}>Binding the Rune</h2>
          
          {/* Always keep the reader div in the DOM during scanning state */}
          <div 
            id="reader" 
            style={{ 
              width: '100%', 
              minHeight: '250px',
              borderRadius: '12px', 
              overflow: 'hidden', 
              border: '2px solid var(--accent-gold)', 
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)',
              background: '#000'
            }}
          ></div>
          
          <p style={{ marginTop: '20px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Capture the sacred rune within the golden frame.</p>
          
          <GlowingButton 
            onClick={() => { stopScanner(); setStatus('waiting'); }} 
            variant="secondary" 
            style={{ marginTop: '20px' }}
          >
            Close the Eye
          </GlowingButton>
        </motion.div>
      );
    }
    
    if (status === 'processing') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <div style={{ width: '60px', height: '60px', border: '4px solid var(--accent-gold)', borderTopColor: 'transparent', borderRadius: '50%', boxShadow: '0 0 20px rgba(184, 134, 11, 0.4)' }} />
          </motion.div>
          <p className="cinzel" style={{ marginTop: '20px', color: 'var(--accent-gold)', letterSpacing: '2px' }}>Consulting the Oracle...</p>
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
          <div style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', trackingWidest: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Fragment Discovered</div>
          <h1 className="cinzel" style={{ color: 'var(--text-primary)', fontSize: '2.5rem', marginBottom: '25px', textShadow: 'var(--gold-glow)' }}>{shard.god}</h1>
          
          <div style={{ 
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
            border: '2px solid var(--accent-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '25px', boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
            position: 'relative'
          }}>
             <div className="shimmer" style={{ fontSize: '4rem' }}>✧</div>
             <div style={{ 
               position: 'absolute', bottom: '-12px', background: 'var(--bg-color)', 
               border: '1px solid var(--accent-gold)', padding: '5px 15px', 
               borderRadius: '20px', fontSize: '0.7rem', color: 'var(--accent-gold)',
               fontWeight: 'bold', textTransform: 'uppercase', trackingWidest: '1px'
             }}>
               {shard.name}
             </div>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '35px', fontStyle: 'italic', fontSize: '1.1rem', lineHeight: '1.6' }}>
            "{shard.desc}"
          </p>
          
          <div style={{ width: '100%', gap: '15px', display: 'flex', flexDirection: 'column' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', padding: '20px', textAlign: 'center', position: 'relative' }}>
      <AnimatePresence>
        <motion.div key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      {(status === 'waiting' || status === 'error') && <BottomNav />}
    </div>
  );
}

