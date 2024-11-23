import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicView } from './pages/PublicView';
import { AdminView } from './pages/AdminView';
import { Navigation } from './components/Navigation';
import { NotificationsContainer } from './components/NotificationsContainer';
import { useThemeStore, getCurrentTheme } from './store/themeStore';
import { useOfflineStatus } from './hooks/useOfflineStatus';
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import { useNotificationStore } from './store/notificationStore';

function App() {
  const { theme } = useThemeStore();
  const currentTheme = getCurrentTheme(theme);
  const isOnline = useOfflineStatus();
  usePerformanceMonitoring();
  const { addNotification } = useNotificationStore();

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful');
            addNotification({
              type: 'success',
              message: 'App is ready for offline use',
              duration: 3000,
            });
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }
  }, [addNotification]);

  return (
    <BrowserRouter>
      <div className={`min-h-screen bg-gray-50 ${currentTheme === 'dark' ? 'dark' : ''}`}>
        <Navigation />
        {!isOnline && (
          <div className="bg-yellow-50 p-2 text-center text-yellow-800">
            You are currently offline. Some features may be limited.
          </div>
        )}
        <NotificationsContainer />
        <Routes>
          <Route path="/" element={<Navigate to="/view" replace />} />
          <Route path="/view" element={<PublicView />} />
          <Route path="/admin" element={<AdminView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;