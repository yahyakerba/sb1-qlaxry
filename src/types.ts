export interface QueueItem {
  id: string;
  name: string;
  joinedAt: Date;
  estimatedWaitTime: number;
}

export interface Room {
  id: string;
  name: string;
  queue: QueueItem[];
  currentlyServing: QueueItem | null;
  averageServiceTime: number;
}

export interface RoomStats {
  totalWaiting: number;
  estimatedWaitTime: number;
}