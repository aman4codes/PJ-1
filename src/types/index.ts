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
  status: 'waiting' | 'served' | 'left';
}

export interface QueueStats {
  currentQueue: number;
  averageWaitTime: number;
  totalServed: number;
  peakTime: string;
  estimatedWaitTime: number;
}

export interface HistoricalData {
  date: string;
  totalStudents: number;
  averageWaitTime: number;
  peakHour: string;
  entries: QueueEntry[];
}