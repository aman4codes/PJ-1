import React, { useState } from 'react';
import { QrCode, User, Clock, CheckCircle, UserCheck, UserPlus } from 'lucide-react';
import { storage } from '../utils/storage';
import { Student, QueueEntry } from '../types';

interface QRScannerProps {
  onScan: (entry: QueueEntry | null) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [qrInput, setQrInput] = useState('');
  const [lastScanned, setLastScanned] = useState<{ student: Student; entry: QueueEntry | null } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (!qrInput.trim()) return;
    
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const student = storage.findStudentByQR(qrInput.trim());
    
    if (!student) {
      alert('Student not found! Please check the QR code.');
      setIsScanning(false);
      return;
    }

    // Check if student is already in queue
    const queue = storage.getQueue();
    const existingEntry = queue.find(
      entry => entry.studentId === student.id && entry.status === 'waiting'
    );

    let result: QueueEntry | null = null;
    
    if (existingEntry) {
      // Student is exiting
      result = storage.exitQueue(student.id);
    } else {
      // Student is entering
      result = storage.addToQueue(student.id);
    }
    
    setLastScanned({ student, entry: result });
    setQrInput('');
    setIsScanning(false);
    onScan(result);
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
            placeholder="Enter QR code (QR001-QR005 for demo)"
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
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border border-green-200 dark:border-green-700 rounded-lg p-6 animate-fadeIn transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <User className="text-green-600 dark:text-green-400" size={24} />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{lastScanned.student.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Roll: {lastScanned.student.rollNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {lastScanned.entry?.status === 'waiting' ? (
                <>
                  <Clock className="text-blue-600 dark:text-blue-400" size={16} />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Entered queue at {lastScanned.entry.entryTime.toLocaleTimeString()}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    Served! Wait time: {lastScanned.entry?.waitTime || 0} minutes
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">How it works:</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <UserPlus className="text-blue-500 dark:text-blue-400" size={16} />
              <span><strong>First scan:</strong> Student enters queue and wait time starts</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="text-green-500 dark:text-green-400" size={16} />
              <span><strong>Second scan:</strong> Student receives food, exits queue, wait time calculated</span>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Demo QR Codes: QR001, QR002, QR003, QR004, QR005</p>
        </div>
      </div>
    </div>
  );
}