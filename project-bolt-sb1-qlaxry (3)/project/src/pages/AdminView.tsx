import React from 'react';
import { Settings, Plus, Users, Loader2 } from 'lucide-react';
import { useQueueStore } from '../store/queueStore';
import { AdminRoomCard } from '../components/AdminRoomCard';
import { AddRoomModal } from '../components/AddRoomModal';
import { AddVisitorModal } from '../components/AddVisitorModal';
import { ErrorBoundary } from 'react-error-boundary';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

// Loading state component
const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3].map((n) => (
      <div key={n} className="h-48 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-50 text-red-800 rounded-lg">
    <h2 className="text-lg font-semibold mb-2">Something went wrong:</h2>
    <pre className="text-sm">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

export function AdminView() {
  const { rooms, isLoading, error } = useQueueStore();
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = React.useState(false);
  const [isAddVisitorModalOpen, setIsAddVisitorModalOpen] = React.useState(false);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Queue Management - Admin
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsAddVisitorModalOpen(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
                         hover:bg-green-700 transition-colors"
              >
                <Users className="w-5 h-5 mr-2" />
                Add Visitor
              </button>
              <button
                onClick={() => setIsAddRoomModalOpen(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg
                         hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Room
              </button>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <AnalyticsDashboard />
        </section>

        <section>
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg">
              {error.message}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <AdminRoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </section>

        <AddRoomModal
          isOpen={isAddRoomModalOpen}
          onClose={() => setIsAddRoomModalOpen(false)}
        />
        <AddVisitorModal
          isOpen={isAddVisitorModalOpen}
          onClose={() => setIsAddVisitorModalOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}