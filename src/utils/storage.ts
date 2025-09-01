import { Student, QueueEntry, HistoricalData } from '../types';

class StorageManager {
  private readonly STUDENTS_KEY = 'mess_students';
  private readonly QUEUE_KEY = 'mess_queue';
  private readonly HISTORY_KEY = 'mess_history';

  // Student management
  getStudents(): Student[] {
    const data = localStorage.getItem(this.STUDENTS_KEY);
    return data ? JSON.parse(data) : this.getDefaultStudents();
  }

  saveStudents(students: Student[]): void {
    localStorage.setItem(this.STUDENTS_KEY, JSON.stringify(students));
  }

  findStudentByQR(qrCode: string): Student | null {
    const students = this.getStudents();
    return students.find(s => s.qrCode === qrCode) || null;
  }

  // Queue management
  getQueue(): QueueEntry[] {
    const data = localStorage.getItem(this.QUEUE_KEY);
    if (!data) return [];
    
    return JSON.parse(data).map((entry: any) => ({
      ...entry,
      entryTime: new Date(entry.entryTime),
      exitTime: entry.exitTime ? new Date(entry.exitTime) : undefined
    }));
  }

  saveQueue(queue: QueueEntry[]): void {
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
  }

  addToQueue(studentId: string): QueueEntry {
    const queue = this.getQueue();
    const newEntry: QueueEntry = {
      id: crypto.randomUUID(),
      studentId,
      entryTime: new Date(),
      status: 'waiting'
    };
    
    queue.push(newEntry);
    this.saveQueue(queue);
    return newEntry;
  }

  exitQueue(studentId: string): QueueEntry | null {
    const queue = this.getQueue();
    const entryIndex = queue.findIndex(
      entry => entry.studentId === studentId && entry.status === 'waiting'
    );
    
    if (entryIndex === -1) return null;
    
    const entry = queue[entryIndex];
    const exitTime = new Date();
    const waitTime = Math.round((exitTime.getTime() - entry.entryTime.getTime()) / (1000 * 60));
    
    queue[entryIndex] = {
      ...entry,
      exitTime,
      waitTime,
      status: 'served'
    };
    
    this.saveQueue(queue);
    this.saveToHistory(queue[entryIndex]);
    return queue[entryIndex];
  }

  // Historical data
  private saveToHistory(entry: QueueEntry): void {
    const history = this.getHistory();
    const today = new Date().toDateString();
    
    let todayData = history.find(h => h.date === today);
    if (!todayData) {
      todayData = {
        date: today,
        totalStudents: 0,
        averageWaitTime: 0,
        peakHour: '12:00',
        entries: []
      };
      history.push(todayData);
    }
    
    todayData.entries.push(entry);
    todayData.totalStudents = todayData.entries.length;
    todayData.averageWaitTime = this.calculateAverageWaitTime(todayData.entries);
    
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  getHistory(): HistoricalData[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  }

  private calculateAverageWaitTime(entries: QueueEntry[]): number {
    const served = entries.filter(e => e.waitTime !== undefined);
    if (served.length === 0) return 0;
    
    const total = served.reduce((sum, entry) => sum + (entry.waitTime || 0), 0);
    return Math.round(total / served.length);
  }

  private getDefaultStudents(): Student[] {
    const defaultStudents = [
      { id: '1', name: 'Aman', rollNumber: 'CS001', email: 'aman@vitbhopal.ac.in', qrCode: 'QR001' },
      { id: '2', name: 'Subhankan', rollNumber: 'CS002', email: 'subhankan@vitbhopal.ac.in', qrCode: 'QR002' },
      { id: '3', name: 'Mayur', rollNumber: 'CS003', email: 'mayur@vitbhopal.ac.in', qrCode: 'QR003' },
      { id: '4', name: 'Hardik', rollNumber: 'CS004', email: 'hardik@vitbhopal.ac.in', qrCode: 'QR004' },
      { id: '5', name: 'Shivam', rollNumber: 'CS005', email: 'shivam@vitbhopal.ac.in', qrCode: 'QR005' },
      { id: '6', name: 'Sushant', rollNumber: 'CS006', email: 'sushant@vitbhopal.ac.in', qrCode: 'QR006' },
      { id: '7', name: 'Ritik', rollNumber: 'CS007', email: 'ritik@vitbhopal.ac.in', qrCode: 'QR007' },
      { id: '8', name: 'Amitesh', rollNumber: 'CS008', email: 'amitesh@vitbhopal.ac.in', qrCode: 'QR008' },
      { id: '9', name: 'Sumit', rollNumber: 'CS009', email: 'sumit@vitbhopal.ac.in', qrCode: 'QR009' },
    ];
    
    this.saveStudents(defaultStudents);
    return defaultStudents;
  }

  // Analytics
  getQueueStats(): any {
    const queue = this.getQueue();
    const currentQueue = queue.filter(entry => entry.status === 'waiting').length;
    const history = this.getHistory();
    const today = history.find(h => h.date === new Date().toDateString());
    
    const served = queue.filter(entry => entry.status === 'served');
    const avgWaitTime = served.length > 0 
      ? Math.round(served.reduce((sum, entry) => sum + (entry.waitTime || 0), 0) / served.length)
      : 0;

    return {
      currentQueue,
      averageWaitTime: avgWaitTime,
      totalServed: served.length,
      peakTime: this.getPeakTime(queue),
      estimatedWaitTime: this.calculateEstimatedWaitTime(currentQueue, avgWaitTime)
    };
  }

  private getPeakTime(entries: QueueEntry[]): string {
    const hourCounts: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      const hour = entry.entryTime.getHours();
      const hourKey = `${hour}:00`;
      hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
    });
    
    let peakHour = '12:00';
    let maxCount = 0;
    
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = hour;
      }
    });
    
    return peakHour;
  }

  private calculateEstimatedWaitTime(queueLength: number, avgWaitTime: number): number {
    if (queueLength === 0) return 0;
    return Math.round(queueLength * Math.max(avgWaitTime * 0.8, 2));
  }

  clearTodayData(): void {
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify([]));
  }

  exportData(): string {
    const students = this.getStudents();
    const queue = this.getQueue();
    const history = this.getHistory();
    
    return JSON.stringify({
      students,
      queue,
      history,
      exportDate: new Date().toISOString()
    }, null, 2);
  }
}

export const storage = new StorageManager();