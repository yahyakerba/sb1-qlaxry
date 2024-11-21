import React from 'react';
import { Clock, Users, UserCheck } from 'lucide-react';
import type { Room } from '../types';

interface RoomCardProps {
  room: Room;
  onJoinQueue: (roomId: string) => void;
}

export function RoomCard({ room, onJoinQueue }: RoomCardProps) {
  const estimatedWaitTime = room.queue.length * room.averageServiceTime;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{room.name}</h3>
      
      <div className="space-y-4">
        <div className="flex items-center text-gray-600">
          <Users className="w-5 h-5 mr-2" />
          <span>Waiting: {room.queue.length}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock className="w-5 h-5 mr-2" />
          <span>Est. Wait: {Math.round(estimatedWaitTime)} mins</span>
        </div>

        {room.currentlyServing && (
          <div className="flex items-center text-green-600">
            <UserCheck className="w-5 h-5 mr-2" />
            <span>Now serving: {room.currentlyServing.name}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onJoinQueue(room.id)}
        className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg
                 hover:bg-indigo-700 transition-colors duration-200"
      >
        Join Queue
      </button>
    </div>
  );
}