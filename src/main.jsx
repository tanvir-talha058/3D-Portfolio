import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initAnalytics } from './lib/analytics';
import { initErrorTracking } from './lib/errorTracking';
import { ThemeProvider } from './contexts/ThemeContext';
import { SoundProvider } from './contexts/SoundContext';

initAnalytics();
initErrorTracking();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <App />
      </SoundProvider>
    </ThemeProvider>
  </React.StrictMode>
);
