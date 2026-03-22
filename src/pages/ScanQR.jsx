import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowingButton from '../components/GlowingButton';
import BottomNav from '../components/BottomNav';

export default function ScanQR() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get('id');
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [fragmentNum, setFragmentNum] = useState(null);
  const [dataUrl, setDataUrl] = useState('');

  const TOTAL_FRAGMENTS = 16;

  useEffect(() => {
    if (!rawId) return;
    
    let parsedNum = rawId.toString().replace('fragment_', '');
    parsedNum = parseInt(parsedNum, 10);
    
    if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= TOTAL_FRAGMENTS) {
      setFragmentNum(parsedNum);
    }
  }, [rawId]);

  useEffect(() => {
    if (fragmentNum) {
      const fetchCustomImage = async () => {
        try {
          // Attempt PNG first
          let res = await fetch(`/hash_fragment_${fragmentNum}.png`);
          if (!res.ok) {
            // Fallback to JPG
            res = await fetch(`/hash_fragment_${fragmentNum}.jpg`);
          }
          if (res.ok) {
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            setDataUrl(objectUrl);
          } else {
            console.error(`Please put hash_fragment_${fragmentNum}.png in the public/ folder.`);
          }
        } catch (error) {
           console.error("Error fetching badge image:", error);
        }
      };
      fetchCustomImage();
    }
  }, [fragmentNum]);

  if (!rawId) {
    return (
      <div style={{ padding: '20px', minHeight: '100dvh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="cinzel" style={{ color: 'var(--accent-blue)' }}>Scanner Active</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>Use your phone's native camera app to scan the physical QR codes hidden around the event!<br/><br/>Scanning will bring you back here to download each badge to your phone.</p>
        <BottomNav />
      </div>
    );
  }

  if (!fragmentNum) {
    return (
      <div style={{ padding: '20px', minHeight: '100dvh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#ff4444' }}>Invalid Fragment Code</h2>
        <GlowingButton onClick={() => navigate('/scan')} variant="secondary" style={{ marginTop: '20px' }}>Return</GlowingButton>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', minHeight: '100dvh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="glass-panel" style={{ padding: '30px', maxWidth: '350px', width: '100%' }}>
        <h1 className="cinzel" style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Badge Discovered</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>This is fragment {fragmentNum} of 16.</p>

        {dataUrl ? (
          <img src={dataUrl} alt={`Fragment ${fragmentNum}`} style={{ width: '100%', borderRadius: '12px', marginBottom: '20px', border: '2px solid var(--accent-blue)', boxShadow: 'var(--glow-shadow)' }} />
        ) : (
          <div style={{ width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--text-secondary)', marginBottom: '20px' }}>Loading your custom badge...</div>
        )}

        {dataUrl && (
          <a href={dataUrl} download={`hash_fragment_${fragmentNum}.png`} style={{ textDecoration: 'none' }}>
             <GlowingButton style={{ marginBottom: '15px' }}>
               Download Badge
             </GlowingButton>
          </a>
        )}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Save this to your camera roll. You will need to upload all 16 to ascend.</p>
      </motion.div>

      <BottomNav />
    </div>
  );
}
