import React, { useState } from 'react';
import { Clock, Users, Settings, Trash2, Play, Check, UserPlus } from 'lucide-react';
import type { Room } from '../types';
import { useQueueStore } from '../store/queueStore';
import { EditRoomModal } from './EditRoomModal';
import { AddVisitorModal } from './AddVisitorModal';

interface AdminRoomCardProps {
  room: Room;
}

export function AdminRoomCard({ room }: AdminRoomCardProps) {
  const { deleteRoom, serveNext, completeService } = useQueueStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddVisitorModalOpen, setIsAddVisitorModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{room.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddVisitorModalOpen(true)}
              className="p-2 text-green-400 hover:text-green-600 transition-colors"
              title="Add visitor to this room"
            >
              <UserPlus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteRoom(room.id)}
              className="p-2 text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2" />
            <span>Waiting: {room.queue.length}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>Service Time: {room.averageServiceTime} mins</span>
          </div>

          {room.currentlyServing ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-800 mb-2">
                Currently Serving
              </p>
              <div className="flex items-center justify-between">
                <span className="text-green-900">{room.currentlyServing.name}</span>
                <button
                  onClick={() => completeService(room.id)}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md
                           hover:bg-green-700 transition-colors text-sm"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Complete
                </button>
              </div>
            </div>
          ) : (
            room.queue.length > 0 && (
              <button
                onClick={() => serveNext(room.id)}
                className="flex items-center w-full justify-center px-4 py-2 bg-indigo-600
                         text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Play className="w-5 h-5 mr-2" />
                Serve Next
              </button>
            )
          )}

          {room.queue.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Queue</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {room.queue.map((item, index) => (
                  <div
                    key={item.id}
                    className="text-sm bg-gray-50 p-2 rounded-lg flex justify-between items-center"
                  >
                    <span className="text-gray-900">
                      {index + 1}. {item.name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {Math.round(item.estimatedWaitTime)} mins
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <EditRoomModal
        room={room}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <AddVisitorModal
        isOpen={isAddVisitorModalOpen}
        onClose={() => setIsAddVisitorModalOpen(false)}
      />
    </>
  );
}