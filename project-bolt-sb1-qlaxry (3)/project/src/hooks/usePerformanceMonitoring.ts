import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';

export function usePerformanceMonitoring() {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log performance metrics
        console.log(`Performance: ${entry.name} - ${entry.duration}ms`);

        // Notify if certain thresholds are exceeded
        if (entry.duration > 3000) {
          addNotification({
            type: 'warning',
            message: `Performance alert: ${entry.name} took ${Math.round(entry.duration)}ms`,
            duration: 5000,
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['measure', 'paint', 'largest-contentful-paint'] });
    } catch (e) {
      console.error('PerformanceObserver error:', e);
    }

    return () => observer.disconnect();
  }, [addNotification]);
}