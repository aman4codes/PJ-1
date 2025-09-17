import { Student, QueueEntry } from '../types';

class StorageManager {
  private readonly STUDENTS_KEY = 'mess_students';
  private readonly QUEUE_KEY = 'mess_queue';
  private readonly QUEUE_CAPACITY = 7;
  private readonly MESS_CAPACITY = 20;

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
      exitTime: entry.exitTime ? new Date(entry.exitTime) : undefined,
      queueEntryTime: entry.queueEntryTime ? new Date(entry.queueEntryTime) : undefined,
      messEntryTime: entry.messEntryTime ? new Date(entry.messEntryTime) : undefined
    }));
  }

  saveQueue(queue: QueueEntry[]): void {
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
  }

  // Get current counts
  getCurrentCounts(): { queueCount: number; messCount: number } {
    const queue = this.getQueue();
    const queueCount = queue.filter(entry => entry.status === 'in_queue').length;
    const messCount = queue.filter(entry => entry.status === 'in_mess').length;
    return { queueCount, messCount };
  }

  // Check if queue has space
  canJoinQueue(): boolean {
    const { queueCount } = this.getCurrentCounts();
    return queueCount < this.QUEUE_CAPACITY;
  }

  // Check if mess has space
  canEnterMess(): boolean {
    const { messCount } = this.getCurrentCounts();
    return messCount < this.MESS_CAPACITY;
  }

  // Add student to queue or handle their progression
  processStudentScan(studentId: string): QueueEntry {
    const queue = this.getQueue();
    
    // Check if student is already in the system
    const existingEntryIndex = queue.findIndex(
      entry => entry.studentId === studentId && 
      (entry.status === 'in_queue' || entry.status === 'in_mess')
    );

    if (existingEntryIndex !== -1) {
      // Student is exiting (either from queue or mess)
      const entry = queue[existingEntryIndex];
      const exitTime = new Date();
      
      let waitTime = 0;
      if (entry.status === 'in_mess' && entry.queueEntryTime) {
        waitTime = Math.round(
          (exitTime.getTime() - entry.queueEntryTime.getTime()) / (1000 * 60)
        );
      }

      const servedEntry: QueueEntry = {
        ...entry,
        exitTime,
        waitTime,
        status: 'served'
      };

      queue[existingEntryIndex] = servedEntry;
      this.saveQueue(queue);
      
      // Process queue after someone exits
      this.processQueueMovement();
      
      return servedEntry;
    }

    // New student trying to join
    if (!this.canJoinQueue()) {
      throw new Error('Queue is full! Please wait for space to become available.');
    }

    const now = new Date();
    const newEntry: QueueEntry = {
      id: crypto.randomUUID(),
      studentId,
      entryTime: now,
      queueEntryTime: now,
      status: 'in_queue'
    };

    queue.push(newEntry);
    this.saveQueue(queue);
    
    // Try to move students from queue to mess
    this.processQueueMovement();
    
    return newEntry;
  }

  // Process movement from queue to mess
  processQueueMovement(): void {
    const queue = this.getQueue();
    
    // Get students in queue, sorted by entry time (FIFO)
    const queuedStudents = queue
      .filter(entry => entry.status === 'in_queue')
      .sort((a, b) => a.queueEntryTime!.getTime() - b.queueEntryTime!.getTime());

    // Move students from queue to mess if space is available
    for (const entry of queuedStudents) {
      if (!this.canEnterMess()) break;
      
      const entryIndex = queue.findIndex(e => e.id === entry.id);
      if (entryIndex !== -1) {
        queue[entryIndex] = {
          ...entry,
          status: 'in_mess',
          messEntryTime: new Date()
        };
      }
    }
    
    this.saveQueue(queue);
  }

  // Force move next student from queue to mess (for manual control)
  moveNextStudentToMess(): QueueEntry | null {
    if (!this.canEnterMess()) return null;
    
    const queue = this.getQueue();
    const nextInQueue = queue
      .filter(entry => entry.status === 'in_queue')
      .sort((a, b) => a.queueEntryTime!.getTime() - b.queueEntryTime!.getTime())[0];

    if (!nextInQueue) return null;

    const entryIndex = queue.findIndex(e => e.id === nextInQueue.id);
    if (entryIndex !== -1) {
      queue[entryIndex] = {
        ...nextInQueue,
        status: 'in_mess',
        messEntryTime: new Date()
      };
      this.saveQueue(queue);
      return queue[entryIndex];
    }

    return null;
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
      { id: '12', name: 'Arjun', rollNumber: 'CS012', email: 'arjun@vitbhopal.ac.in', qrCode: 'QR012' },
      { id: '13', name: 'Vikram', rollNumber: 'CS013', email: 'vikram@vitbhopal.ac.in', qrCode: 'QR013' },
      { id: '14', name: 'Rohit', rollNumber: 'CS014', email: 'rohit@vitbhopal.ac.in', qrCode: 'QR014' },
      { id: '15', name: 'Karan', rollNumber: 'CS015', email: 'karan@vitbhopal.ac.in', qrCode: 'QR015' },
      { id: '16', name: 'Nikhil', rollNumber: 'CS016', email: 'nikhil@vitbhopal.ac.in', qrCode: 'QR016' },
      { id: '17', name: 'Aditya', rollNumber: 'CS017', email: 'aditya@vitbhopal.ac.in', qrCode: 'QR017' },
      { id: '18', name: 'Prateek', rollNumber: 'CS018', email: 'prateek@vitbhopal.ac.in', qrCode: 'QR018' },
      { id: '19', name: 'Ankit', rollNumber: 'CS019', email: 'ankit@vitbhopal.ac.in', qrCode: 'QR019' },
      { id: '20', name: 'Deepak', rollNumber: 'CS020', email: 'deepak@vitbhopal.ac.in', qrCode: 'QR020' },
      { id: '21', name: 'Gaurav', rollNumber: 'CS021', email: 'gaurav@vitbhopal.ac.in', qrCode: 'QR021' },
      { id: '22', name: 'Manish', rollNumber: 'CS022', email: 'manish@vitbhopal.ac.in', qrCode: 'QR022' },
      { id: '23', name: 'Rajesh', rollNumber: 'CS023', email: 'rajesh@vitbhopal.ac.in', qrCode: 'QR023' },
      { id: '24', name: 'Suresh', rollNumber: 'CS024', email: 'suresh@vitbhopal.ac.in', qrCode: 'QR024' },
      { id: '25', name: 'Akash', rollNumber: 'CS025', email: 'akash@vitbhopal.ac.in', qrCode: 'QR025' },
      { id: '26', name: 'Vishal', rollNumber: 'CS026', email: 'vishal@vitbhopal.ac.in', qrCode: 'QR026' },
    ];

    this.saveStudents(defaultStudents);
    return defaultStudents;
  }

  // Analytics
  getQueueStats(): any {
    const queue = this.getQueue();
    const { queueCount, messCount } = this.getCurrentCounts();

    const served = queue.filter(entry => entry.status === 'served');

    const avgWaitTime = served.length > 0
      ? Math.round(
          served.reduce((sum, entry) => sum + (entry.waitTime || 0), 0) / served.length
        )
      : 0;

    const peakTime = this.computePeakHourFromEntries(served.length ? served : queue);

    return {
      currentQueueCount: queueCount,
      currentMessCount: messCount,
      averageWaitTime: avgWaitTime,
      totalServed: served.length,
      peakTime,
      estimatedWaitTime: this.calculateEstimatedWaitTime(queueCount, avgWaitTime),
      queueCapacity: this.QUEUE_CAPACITY,
      messCapacity: this.MESS_CAPACITY
    };
  }

  private computePeakHourFromEntries(entries: QueueEntry[]): string {
    const timeCounts: { [key: string]: number } = {};

    entries.forEach(e => {
      const d = e.queueEntryTime || e.entryTime;
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
    return Math.round(queueLength * Math.max(avgWaitTime * 0.8, 3));
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