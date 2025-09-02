import { Student, QueueEntry } from '../types';

class StorageManager {
  private readonly STUDENTS_KEY = 'mess_students';
  private readonly QUEUE_KEY = 'mess_queue';


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

    const waitingIndex = queue.findIndex(
      entry => entry.studentId === studentId && entry.status === 'waiting'
    );

    if (waitingIndex !== -1) {
      const entry = queue[waitingIndex];
      const exitTime = new Date();
      const waitTime = Math.round(
        (exitTime.getTime() - entry.entryTime.getTime()) / (1000 * 60)
      );

      const servedEntry: QueueEntry = {
        ...entry,
        exitTime,
        waitTime,
        status: 'served'
      };

      queue[waitingIndex] = servedEntry;
      this.saveQueue(queue);
      return servedEntry;
    }

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
    const waitTime = Math.round(
      (exitTime.getTime() - entry.entryTime.getTime()) / (1000 * 60)
    );

    queue[entryIndex] = {
      ...entry,
      exitTime,
      waitTime,
      status: 'served'
    };

    this.saveQueue(queue);
    return queue[entryIndex];
  }

  // Default students
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
      { id: '10', name: 'Kushagra', rollNumber: 'CS010', email: 'kushagra@vitbhopal.ac.in', qrCode: 'QR010' },
      { id: '11', name: 'Anan', rollNumber: 'CS011', email: 'anan@vitbhopal.ac.in', qrCode: 'QR011' },
    ];

    this.saveStudents(defaultStudents);
    return defaultStudents;
  }

  // Analytics
  getQueueStats(): any {
    const queue = this.getQueue();

    const currentQueue = queue.filter(entry => entry.status === 'waiting').length;
    const served = queue.filter(entry => entry.status === 'served');

    const avgWaitTime = served.length > 0
      ? Math.round(
          served.reduce((sum, entry) => sum + (entry.waitTime || 0), 0) / served.length
        )
      : 0;

    const peakTime = this.computePeakHourFromEntries(served.length ? served : queue);

    return {
      currentQueue,
      averageWaitTime: avgWaitTime,
      totalServed: served.length,
      peakTime,
      estimatedWaitTime: this.calculateEstimatedWaitTime(currentQueue, avgWaitTime)
    };
  }

  private computePeakHourFromEntries(entries: QueueEntry[]): string {
    const timeCounts: { [key: string]: number } = {};

    entries.forEach(e => {
      const d = e.entryTime;
      if (!d || !(d instanceof Date)) return;
      const hour = d.getHours().toString().padStart(2, '0');
      const minute = d.getMinutes().toString().padStart(2, '0');
      const timeKey = `${hour}:${minute}`;
      timeCounts[timeKey] = (timeCounts[timeKey] || 0) + 1;
    });

    let peakHour = '00:00';
    let maxCount = 0;
    Object.entries(timeCounts).forEach(([time, count]) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = time;
      }
    });

    return peakHour;
  }

  private calculateEstimatedWaitTime(queueLength: number, avgWaitTime: number): number {
    if (queueLength === 0) return 0;
    return Math.round(queueLength * Math.max(avgWaitTime * 0.8, 2));
  }

  // Utilities
  clearTodayData(): void {
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify([]));
  }

  exportData(): string {
    const students = this.getStudents();
    const queue = this.getQueue();

    return JSON.stringify({
      students,
      queue,
      exportDate: new Date().toISOString()
    }, null, 2);
  }
}

export const storage = new StorageManager();
