import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { QRScanner } from './components/QRScanner';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { StudentList } from './components/StudentList';
import { storage } from './utils/storage';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { QueueEntry } from './types';
import { useEffect, useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { updateTrigger, triggerUpdate } = useRealTimeUpdates();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleScan = (entry: QueueEntry | null) => {
    triggerUpdate();
    
    if (entry) {
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
      notification.textContent = entry.status === 'in_queue' ? 'Student added to queue!' : 'Student served!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  const students = storage.getStudents();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header currentTime={currentTime} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'scanner' && (
          <div className="max-w-2xl mx-auto">
            <QRScanner onScan={handleScan} />
          </div>
        )}
        
        {activeTab === 'dashboard' && <Dashboard key={updateTrigger} onUpdate={triggerUpdate} />}
        
        {activeTab === 'analytics' && <Analytics key={updateTrigger} />}
        
        {activeTab === 'students' && (
          <StudentList students={students} />
        )}
      </main>
    </div>
  );
}

export default App;
