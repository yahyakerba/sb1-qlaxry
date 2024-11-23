import { create } from 'zustand';
import type { Room, QueueItem } from '../types';

interface QueueStore {
  rooms: Room[];
  isLoading: boolean;
  error: Error | null;
  addRoom: (room: Omit<Room, 'id' | 'queue' | 'currentlyServing'>) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;
  addToQueue: (roomId: string, name: string) => Promise<void>;
  removeFromQueue: (roomId: string, queueItemId: string) => void;
  serveNext: (roomId: string) => void;
  completeService: (roomId: string) => void;
  subscribeToUpdates: (callback: (rooms: Room[]) => void) => () => void;
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

export const useQueueStore = create<QueueStore>((set, get) => ({
  rooms: initialRooms,
  isLoading: false,
  error: null,
  
  addRoom: (room) => {
    set((state) => ({
      rooms: [...state.rooms, {
        ...room,
        id: Math.random().toString(36).substr(2, 9),
        queue: [],
        currentlyServing: null,
      }],
      error: null,
    }));
  },

  updateRoom: (roomId, updates) => {
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? { ...room, ...updates } : room
      ),
      error: null,
    }));
  },

  deleteRoom: (roomId) => {
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== roomId),
      error: null,
    }));
  },

  addToQueue: async (roomId, name) => {
    set({ isLoading: true, error: null });
    
    try {
      const newQueueItem: QueueItem = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        joinedAt: new Date(),
        estimatedWaitTime: 0,
      };

      set((state) => ({
        rooms: state.rooms.map((room) => {
          if (room.id !== roomId) return room;

          const updatedQueue = [...room.queue, newQueueItem];
          const estimatedWaitTime = (updatedQueue.length) * room.averageServiceTime;
          
          // Update wait times for all items in queue
          const queueWithUpdatedTimes = updatedQueue.map((item, index) => ({
            ...item,
            estimatedWaitTime: (index + 1) * room.averageServiceTime,
          }));

          return {
            ...room,
            queue: queueWithUpdatedTimes,
            currentlyServing: room.currentlyServing || queueWithUpdatedTimes[0] || null,
          };
        }),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  removeFromQueue: (roomId, queueItemId) => {
    set((state) => ({
      rooms: state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        
        const updatedQueue = room.queue.filter((item) => item.id !== queueItemId);
        
        // Update wait times for remaining items
        const queueWithUpdatedTimes = updatedQueue.map((item, index) => ({
          ...item,
          estimatedWaitTime: (index + 1) * room.averageServiceTime,
        }));

        return {
          ...room,
          queue: queueWithUpdatedTimes,
        };
      }),
      error: null,
    }));
  },

  serveNext: (roomId) => {
    set((state) => ({
      rooms: state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        
        const updatedQueue = [...room.queue];
        const nextPerson = updatedQueue.shift();

        // Update wait times for remaining items
        const queueWithUpdatedTimes = updatedQueue.map((item, index) => ({
          ...item,
          estimatedWaitTime: (index + 1) * room.averageServiceTime,
        }));

        return {
          ...room,
          queue: queueWithUpdatedTimes,
          currentlyServing: nextPerson || null,
        };
      }),
      error: null,
    }));
  },

  completeService: (roomId) => {
    set((state) => ({
      rooms: state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        return {
          ...room,
          currentlyServing: null,
        };
      }),
      error: null,
    }));
  },

  subscribeToUpdates: (callback) => {
    // Set up subscription
    const unsubscribe = () => {
      // Cleanup subscription
    };
    return unsubscribe;
  },
}));