import React, { useState } from 'react';
import { Settings, Plus, Users } from 'lucide-react';
import { useQueueStore } from '../store/queueStore';
import { AdminRoomCard } from '../components/AdminRoomCard';
import { AddRoomModal } from '../components/AddRoomModal';
import { AddVisitorModal } from '../components/AddVisitorModal';

export function AdminView() {
  const { rooms } = useQueueStore();
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isAddVisitorModalOpen, setIsAddVisitorModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <AdminRoomCard key={room.id} room={room} />
          ))}
        </div>
      </main>

      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
      />
      <AddVisitorModal
        isOpen={isAddVisitorModalOpen}
        onClose={() => setIsAddVisitorModalOpen(false)}
      />
    </>
  );
}