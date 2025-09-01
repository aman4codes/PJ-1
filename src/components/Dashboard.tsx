
import { QueueStatus } from './QueueStatus';
import { CurrentQueue } from './CurrentQueue';
import { storage } from '../utils/storage';

interface DashboardProps {
  onUpdate?: () => void;
}

export function Dashboard({ onUpdate }: DashboardProps) {
  const stats = storage.getQueueStats();
  const queue = storage.getQueue();
  const students = storage.getStudents();

  return (
    <div className="space-y-6">
      <QueueStatus stats={stats} />
      <CurrentQueue queue={queue} students={students} onUpdate={onUpdate} />
    </div>
  );
}