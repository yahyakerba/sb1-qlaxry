import { create } from 'zustand';
import type { Room, QueueItem } from '../types';

interface QueueStore {
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id' | 'queue' | 'currentlyServing'>) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;
  addToQueue: (roomId: string, name: string) => void;
  removeFromQueue: (roomId: string, queueItemId: string) => void;
  serveNext: (roomId: string) => void;
  completeService: (roomId: string) => void;
}

const initialRooms: Room[] = [
  {
    id: '1',
    name: 'Consultation Room A',
    queue: [],
    currentlyServing: null,
    averageServiceTime: 15,
  },
  {
    id: '2',
    name: 'Consultation Room B',
    queue: [],
    currentlyServing: null,
    averageServiceTime: 20,
  },
  {
    id: '3',
    name: 'Treatment Room',
    queue: [],
    currentlyServing: null,
    averageServiceTime: 30,
  },
];

export const useQueueStore = create<QueueStore>((set) => ({
  rooms: initialRooms,
  
  addRoom: (room) => set((state) => ({
    rooms: [...state.rooms, {
      ...room,
      id: Math.random().toString(36).substr(2, 9),
      queue: [],
      currentlyServing: null,
    }],
  })),

  updateRoom: (roomId, updates) => set((state) => ({
    rooms: state.rooms.map((room) =>
      room.id === roomId ? { ...room, ...updates } : room
    ),
  })),

  deleteRoom: (roomId) => set((state) => ({
    rooms: state.rooms.filter((room) => room.id !== roomId),
  })),

  addToQueue: (roomId, name) => set((state) => ({
    rooms: state.rooms.map((room) => {
      if (room.id !== roomId) return room;

      const newQueueItem: QueueItem = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        joinedAt: new Date(),
        estimatedWaitTime: (room.queue.length + 1) * room.averageServiceTime,
      };

      const updatedQueue = [...room.queue, newQueueItem];
      
      return {
        ...room,
        queue: updatedQueue,
        currentlyServing: room.currentlyServing || updatedQueue[0] || null,
      };
    }),
  })),

  removeFromQueue: (roomId, queueItemId) => set((state) => ({
    rooms: state.rooms.map((room) => {
      if (room.id !== roomId) return room;
      return {
        ...room,
        queue: room.queue.filter((item) => item.id !== queueItemId),
      };
    }),
  })),

  serveNext: (roomId) => set((state) => ({
    rooms: state.rooms.map((room) => {
      if (room.id !== roomId) return room;
      
      const updatedQueue = [...room.queue];
      const nextPerson = updatedQueue.shift();

      return {
        ...room,
        queue: updatedQueue,
        currentlyServing: nextPerson || null,
      };
    }),
  })),

  completeService: (roomId) => set((state) => ({
    rooms: state.rooms.map((room) => {
      if (room.id !== roomId) return room;
      return {
        ...room,
        currentlyServing: null,
      };
    }),
  })),
}));