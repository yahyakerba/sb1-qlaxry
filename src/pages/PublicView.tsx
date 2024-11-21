import React from 'react';
import { ListOrdered, LayoutGrid } from 'lucide-react';
import { useQueueStore } from '../store/queueStore';
import { RoomCard } from '../components/RoomCard';
import { QueueList } from '../components/QueueList';
import { JoinQueueModal } from '../components/JoinQueueModal';

export function PublicView() {
  const { rooms, addToQueue } = useQueueStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(null);

  const handleJoinQueue = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsModalOpen(true);
  };

  const handleSubmitQueue = (name: string) => {
    if (selectedRoomId) {
      addToQueue(selectedRoomId, name);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ListOrdered className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Queue Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LayoutGrid className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600">
                {rooms.reduce((acc, room) => acc + room.queue.length, 0)} waiting
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onJoinQueue={handleJoinQueue}
            />
          ))}
        </div>

        <div className="mt-8">
          {rooms.map(room => (
            <div key={room.id} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {room.name} Queue
              </h2>
              <QueueList
                items={room.queue}
                currentlyServing={room.currentlyServing}
              />
            </div>
          ))}
        </div>
      </main>

      <JoinQueueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitQueue}
        roomName={rooms.find(r => r.id === selectedRoomId)?.name || ''}
      />
    </>
  );
}