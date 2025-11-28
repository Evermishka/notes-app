import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@app/.';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.warn('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.warn('SW registration failed: ', registrationError);
      });
  });
}
