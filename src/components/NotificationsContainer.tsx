import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useNotificationStore, NotificationType } from '../store/notificationStore';

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-400" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-blue-400" />;
  }
};

interface NotificationItemProps {
  type: NotificationType;
  message: string;
  id: string;
}

const NotificationItem = ({ type, message, id }: NotificationItemProps) => {
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  const baseStyles = "flex items-center p-4 rounded-lg shadow-lg max-w-md w-full";
  const typeStyles = {
    success: "bg-green-50 text-green-800 border border-green-100",
    error: "bg-red-50 text-red-800 border border-red-100",
    warning: "bg-yellow-50 text-yellow-800 border border-yellow-100",
    info: "bg-blue-50 text-blue-800 border border-blue-100"
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      <NotificationIcon type={type} />
      <p className="ml-3 mr-8 flex-1">{message}</p>
      <button
        onClick={() => removeNotification(id)}
        className="p-1 rounded-full hover:bg-gray-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export function NotificationsContainer() {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <div className="fixed bottom-4 right-4 space-y-4 z-50">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </div>
  );
}