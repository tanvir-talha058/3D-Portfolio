import React, { createContext, useContext } from 'react';
import { useCyberSound } from '../hooks/useCyberSound';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const sound = useCyberSound();
  return <SoundContext.Provider value={sound}>{children}</SoundContext.Provider>;
}

// The provider and its hook are one cohesive unit; splitting them into
// separate files only to satisfy Fast Refresh isn't worth the fragmentation.
// eslint-disable-next-line react-refresh/only-export-components
export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within a SoundProvider');
  return ctx;
}
