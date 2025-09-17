import { Clock, User, ArrowRight, UserCheck, Building2, Users } from 'lucide-react';
import { QueueEntry, Student } from '../types';
import { storage } from '../utils/storage';

interface CurrentQueueProps {
  queue: QueueEntry[];
  students: Student[];
  onUpdate?: () => void;
}

export function CurrentQueue({ queue, students, onUpdate }: CurrentQueueProps) {
  const queuedStudents = queue.filter(entry => entry.status === 'in_queue');
  const messStudents = queue.filter(entry => entry.status === 'in_mess');
  
  const getStudentById = (id: string): Student | undefined => {
    return students.find(s => s.id === id);
  };

  const handleServeStudent = (studentId: string) => {
    const result = storage.processStudentScan(studentId);
    if (result && onUpdate) {
      onUpdate();
    }
  };

  const handleMoveToMess = () => {
    const result = storage.moveNextStudentToMess();
    if (result && onUpdate) {
      onUpdate();
    }
  };

  const getWaitTime = (entryTime: Date): string => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - entryTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just joined';
    if (diffMinutes === 1) return '1 minute';
    return `${diffMinutes} minutes`;
  };

  const getPositionColor = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    if (index <= 2) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
    return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Queue Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Queue (Stage 1)</h2>
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-sm font-medium">
              {queuedStudents.length}/7 waiting
            </span>
          </div>
          {queuedStudents.length > 0 && storage.canEnterMess() && (
            <button
              onClick={handleMoveToMess}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              <ArrowRight size={16} />
              Move to Mess
            </button>
          )}
        </div>

        {queuedStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No students in queue</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Queue can hold up to 7 students</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {queuedStudents
              .sort((a, b) => a.queueEntryTime!.getTime() - b.queueEntryTime!.getTime())
              .map((entry, index) => {
                const student = getStudentById(entry.studentId);
                if (!student) return null;

                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md dark:hover:shadow-gray-900/20 transition-all bg-white dark:bg-gray-700"
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getPositionColor(index)}`}>
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{student.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Roll: {student.rollNumber}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Clock size={16} />
                        <span className="text-sm">{getWaitTime(entry.queueEntryTime!)}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {entry.queueEntryTime!.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {index === 0 && storage.canEnterMess() && (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <ArrowRight size={20} />
                        <span className="text-sm font-medium ml-1">Ready</span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Mess Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="text-orange-600 dark:text-orange-400" size={24} />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Mess Hall (Stage 2)</h2>
          <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full text-sm font-medium">
            {messStudents.length}/20 inside
          </span>
        </div>

        {messStudents.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No students in mess</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Mess can hold up to 20 students</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {messStudents
              .sort((a, b) => a.messEntryTime!.getTime() - b.messEntryTime!.getTime())
              .map((entry) => {
                const student = getStudentById(entry.studentId);
                if (!student) return null;

                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md dark:hover:shadow-gray-900/20 transition-all bg-white dark:bg-gray-700"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                      <Building2 className="text-orange-600 dark:text-orange-400" size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{student.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Roll: {student.rollNumber}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Clock size={16} />
                        <span className="text-sm">{getWaitTime(entry.messEntryTime!)}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Entered: {entry.messEntryTime!.toLocaleTimeString()}
                      </p>
                      {entry.queueEntryTime && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total: {getWaitTime(entry.queueEntryTime)}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleServeStudent(entry.studentId)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      title="Mark as served and exit"
                    >
                      <UserCheck size={16} />
                      Exit
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}