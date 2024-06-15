import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/assets/js/offline-sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, error => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

// Create root and render App
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
