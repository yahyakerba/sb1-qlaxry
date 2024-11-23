import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useQueueStore } from '../store/queueStore';

interface AddVisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVisitorModal({ isOpen, onClose }: AddVisitorModalProps) {
  const { rooms, addToQueue } = useQueueStore();
  const [name, setName] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedRoomId) {
      addToQueue(selectedRoomId, name.trim());
      setName('');
      setSelectedRoomId('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Visitor</h3>
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
                Visitor Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                         focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter visitor name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="room"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Room
              </label>
              <select
                id="room"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                         focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a room...</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.queue.length} waiting)
                  </option>
                ))}
              </select>
            </div>

            {selectedRoomId && (
              <div className="text-sm text-gray-600">
                Current queue length: {rooms.find(r => r.id === selectedRoomId)?.queue.length || 0}
                <br />
                Estimated wait time: {
                  Math.round(
                    ((rooms.find(r => r.id === selectedRoomId)?.queue.length || 0) + 1) *
                    (rooms.find(r => r.id === selectedRoomId)?.averageServiceTime || 0)
                  )
                } minutes
              </div>
            )}
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
              Add Visitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}