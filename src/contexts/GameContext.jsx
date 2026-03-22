import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, USE_MOCK } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const { currentUser } = useAuth();
  const [fragments, setFragments] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const TOTAL_FRAGMENTS = 16;

  useEffect(() => {
    if (!currentUser) {
      setFragments([]);
      setCompleted(false);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (USE_MOCK) {
          const localData = localStorage.getItem(`hash_data_${currentUser.uid}`);
          if (localData) {
            const parsed = JSON.parse(localData);
            setFragments(parsed.fragments || []);
            setCompleted(parsed.completed || false);
          } else {
            setFragments([]);
            setCompleted(false);
            localStorage.setItem(`hash_data_${currentUser.uid}`, JSON.stringify({ fragments: [], completed: false }));
          }
        } else {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFragments(data.fragmentsCollected || []);
            setCompleted(data.completed || false);
          } else {
            await setDoc(doc(db, 'users', currentUser.uid), {
              name: currentUser.displayName || 'Warrior',
              email: currentUser.email || '',
              fragmentsCollected: [],
              completed: false
            });
            setFragments([]);
            setCompleted(false);
          }
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  const unlockFragment = async (rawId) => {
    if (!currentUser) return { status: 'error' };
    
    let parsedNum = rawId.toString().replace('fragment_', '');
    parsedNum = parseInt(parsedNum, 10);
    
    if (isNaN(parsedNum) || parsedNum < 1 || parsedNum > TOTAL_FRAGMENTS) {
      return { status: 'error' };
    }
    
    const fragmentId = `fragment_${parsedNum}`;

    if (fragments.includes(fragmentId)) {
      return { status: 'duplicate' };
    }

    const newFragments = [...fragments, fragmentId];
    const isCompleted = newFragments.length === TOTAL_FRAGMENTS;

    try {
      if (USE_MOCK) {
        localStorage.setItem(`hash_data_${currentUser.uid}`, JSON.stringify({
          fragments: newFragments,
          completed: isCompleted
        }));
      } else {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          fragmentsCollected: arrayUnion(fragmentId),
          completed: isCompleted
        });
      }
      setFragments(newFragments);
      setCompleted(isCompleted);
      return { status: 'new' };
    } catch (err) {
      console.error('Error unlocking fragment', err);
      return { status: 'error' };
    }
  };

  const clearProgress = async () => {
     if (!currentUser) return;
     if (USE_MOCK) {
        localStorage.setItem(`hash_data_${currentUser.uid}`, JSON.stringify({
          fragments: [],
          completed: false
        }));
     } else {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          fragmentsCollected: [],
          completed: false
        });
     }
     setFragments([]);
     setCompleted(false);
  }

  const value = {
    fragments,
    completed,
    loading,
    unlockFragment,
    clearProgress,
    TOTAL_FRAGMENTS
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
