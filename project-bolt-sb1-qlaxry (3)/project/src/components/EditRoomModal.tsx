import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useQueueStore } from '../store/queueStore';
import type { Room } from '../types';

interface EditRoomModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

export function EditRoomModal({ room, isOpen, onClose }: EditRoomModalProps) {
  const { updateRoom } = useQueueStore();
  const [name, setName] = useState(room.name);
  const [averageServiceTime, setAverageServiceTime] = useState(
    room.averageServiceTime.toString()
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && Number(averageServiceTime) > 0) {
      updateRoom(room.id, {
        name: name.trim(),
        averageServiceTime: Number(averageServiceTime),
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Edit Room</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Room Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                         focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter room name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="serviceTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Average Service Time (minutes)
              </label>
              <input
                type="number"
                id="serviceTime"
                value={averageServiceTime}
                onChange={(e) => setAverageServiceTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                         focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg
                       hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                       hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}