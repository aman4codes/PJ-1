export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  qrCode: string;
}

export interface QueueEntry {
  id: string;
  studentId: string;
  entryTime: Date;
  exitTime?: Date;
  waitTime?: number; // in minutes
  status: 'in_queue' | 'in_mess' | 'served' | 'left';
  queueEntryTime?: Date;
  messEntryTime?: Date;
}

export interface QueueStats {
  currentQueueCount: number;
  currentMessCount: number;
  averageWaitTime: number;
  totalServed: number;
  peakTime: string;
  estimatedWaitTime: number;
  queueCapacity: number;
  messCapacity: number;
}

export interface HistoricalData {
  date: string;
  totalStudents: number;
  averageWaitTime: number;
  peakHour: string;
  entries: QueueEntry[];
}
