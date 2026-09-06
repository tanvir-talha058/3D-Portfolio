import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('portfolio_theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('portfolio_theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('portfolio_theme', 'dark');
    }
  }, [isLightMode]);

  const toggleTheme = () => setIsLightMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

// The provider and its hook are one cohesive unit; splitting them into
// separate files only to satisfy Fast Refresh isn't worth the fragmentation.
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
