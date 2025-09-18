import React, { useState } from 'react';
import { QrCode, User, Clock, CheckCircle, UserCheck, UserPlus, AlertCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import { Student, QueueEntry } from '../types';

interface QRScannerProps {
  onScan: (entry: QueueEntry | null) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [qrInput, setQrInput] = useState('');
  const [lastScanned, setLastScanned] = useState<{ student: Student; entry: QueueEntry | null } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!qrInput.trim()) return;
    
    setIsScanning(true);
    setError(null);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const student = storage.findStudentByQR(qrInput.trim());
    
    if (!student) {
      setError('Student not found! Please check the QR code.');
      setIsScanning(false);
      return;
    }

    try {
      const result = storage.processStudentScan(student.id);
      setLastScanned({ student, entry: result });
      setQrInput('');
      onScan(result);
    } catch (err) {
      setError((err as Error).message);
    }
    
    setIsScanning(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <QrCode size={64} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">QR Scanner</h2>
        <p className="text-gray-600 dark:text-gray-300">Scan student QR code for entry/exit</p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter QR code (QR001-QR050 for demo)"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isScanning}
          />
          <button
            onClick={handleScan}
            disabled={isScanning || !qrInput.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isScanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        {lastScanned && (
          <div className={`border rounded-lg p-6 animate-fadeIn transition-colors ${
            lastScanned.entry?.status === 'served' 
              ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-green-200 dark:border-green-700'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <User className={lastScanned.entry?.status === 'served' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'} size={24} />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{lastScanned.student.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Roll: {lastScanned.student.rollNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {lastScanned.entry?.status === 'in_queue' ? (
                <>
                  <Clock className="text-blue-600 dark:text-blue-400" size={16} />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Joined queue at {lastScanned.entry.queueEntryTime?.toLocaleTimeString()}
                  </span>
                </>
              ) : lastScanned.entry?.status === 'in_mess' ? (
                <>
                  <UserCheck className="text-orange-600 dark:text-orange-400" size={16} />
                  <span className="text-orange-700 dark:text-orange-300 font-medium">
                    Entered mess at {lastScanned.entry.messEntryTime?.toLocaleTimeString()}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    Completed! Total time: {lastScanned.entry?.waitTime || 0} minutes
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 animate-fadeIn transition-colors">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
              <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Two-Stage System:</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <UserPlus className="text-blue-500 dark:text-blue-400" size={16} />
              <span><strong>Stage 1:</strong> Student joins queue (max 7 students)</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="text-orange-500 dark:text-orange-400" size={16} />
              <span><strong>Stage 2:</strong> Student enters mess when space available (max 20 students)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 dark:text-green-400" size={16} />
              <span><strong>Final scan:</strong> Student exits mess, total time calculated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}