import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, USE_MOCK } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) {
      const mockUser = localStorage.getItem('hash_mock_user');
      if (mockUser) {
        setCurrentUser(JSON.parse(mockUser));
      }
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => {
    if (USE_MOCK) {
      const user = { uid: 'mock_uid_123', displayName: 'Chosen Warrior' };
      localStorage.setItem('hash_mock_user', JSON.stringify(user));
      setCurrentUser(user);
      return Promise.resolve();
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const loginAnon = () => {
    if (USE_MOCK) {
      const user = { uid: 'mock_anon_' + Date.now(), displayName: 'Wanderer' };
      localStorage.setItem('hash_mock_user', JSON.stringify(user));
      setCurrentUser(user);
      return Promise.resolve();
    }
    return signInAnonymously(auth);
  };

  const logout = () => {
    if (USE_MOCK) {
      localStorage.removeItem('hash_mock_user');
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  const value = {
    currentUser,
    loginWithGoogle,
    loginAnon,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
