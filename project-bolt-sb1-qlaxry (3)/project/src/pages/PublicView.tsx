import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ListOrdered, LayoutGrid, Loader2 } from 'lucide-react';
import { useQueueStore } from '../store/queueStore';
import { RoomCard } from '../components/RoomCard';
import { QueueList } from '../components/QueueList';
import { JoinQueueModal } from '../components/JoinQueueModal';
import { ErrorBoundary } from 'react-error-boundary';
import { useVirtualizer } from '@tanstack/react-virtual';

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

export function PublicView() {
  const { rooms, addToQueue, isLoading, error, subscribeToUpdates } = useQueueStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, any>>({});

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToUpdates((updatedRooms) => {
      // Handle real-time updates
    });
    return () => unsubscribe();
  }, [subscribeToUpdates]);

  // Memoize total waiting count
  const totalWaiting = useMemo(() => 
    rooms.reduce((acc, room) => acc + room.queue.length, 0),
    [rooms]
  );

  // Optimistic queue updates
  const handleJoinQueue = useCallback(async (roomId: string, name: string) => {
    const optimisticId = `temp-${Date.now()}`;
    const optimisticQueueItem = {
      id: optimisticId,
      name,
      timestamp: new Date(),
    };

    // Add optimistic update
    setOptimisticUpdates(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), optimisticQueueItem]
    }));

    try {
      await addToQueue(roomId, name);
    } catch (error) {
      // Revert optimistic update
      setOptimisticUpdates(prev => {
        const updated = { ...prev };
        updated[roomId] = (updated[roomId] || []).filter(item => item.id !== optimisticId);
        return updated;
      });
      console.error('Failed to join queue:', error);
    }
  }, [addToQueue]);

  const handleOpenModal = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRoomId(null);
  }, []);

  const selectedRoom = useMemo(() => 
    rooms.find(r => r.id === selectedRoomId),
    [rooms, selectedRoomId]
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <header className="bg-white shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ListOrdered className="w-8 h-8 text-indigo-600 mr-3" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-gray-900">
                Queue Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4" aria-live="polite">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              ) : (
                <>
                  <LayoutGrid className="w-6 h-6 text-gray-400" aria-hidden="true" />
                  <span className="text-gray-600">
                    {totalWaiting} waiting
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg">
            {error.message}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={{
                    ...room,
                    queue: [...room.queue, ...(optimisticUpdates[room.id] || [])]
                  }}
                  onJoinQueue={handleOpenModal}
                />
              ))}
            </div>

            <div className="mt-8 space-y-8">
              {rooms.map(room => (
                <div key={room.id} className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {room.name} Queue
                  </h2>
                  <QueueList
                    items={[...room.queue, ...(optimisticUpdates[room.id] || [])]}
                    currentlyServing={room.currentlyServing}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <JoinQueueModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(name) => selectedRoomId && handleJoinQueue(selectedRoomId, name)}
        roomName={selectedRoom?.name || ''}
      />
    </ErrorBoundary>
  );
}