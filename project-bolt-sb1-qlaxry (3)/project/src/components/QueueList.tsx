import React from 'react';
import { Clock, User } from 'lucide-react';
import type { QueueItem } from '../types';

interface QueueListProps {
  items: QueueItem[];
  currentlyServing: QueueItem | null;
}

export function QueueList({ items, currentlyServing }: QueueListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Queue</h3>
      
      {currentlyServing && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-green-600 mb-2">Now Serving</h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-green-900 font-medium">
                  {currentlyServing.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 transition-all
                     hover:border-indigo-200 hover:bg-indigo-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600
                               flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="ml-3 font-medium text-gray-900">{item.name}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {Math.round(item.estimatedWaitTime)} mins
                </span>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No one is currently waiting
          </div>
        )}
      </div>
    </div>
  );
}