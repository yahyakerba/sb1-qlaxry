import { useState, useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification({
        type: 'success',
        message: 'Connection restored! You are back online.',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        type: 'warning',
        message: 'You are offline. Some features may be limited.',
        duration: 0, // Keep showing until back online
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  return isOnline;
}