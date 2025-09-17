import { BarChart3, Download, Users, Clock } from 'lucide-react';
import { storage } from '../utils/storage';

export function Analytics() {
  // const history = storage.getHistory();
  const stats = storage.getQueueStats();
  
  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mess-queue-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear today\'s queue data? This action cannot be undone.')) {
      storage.clearTodayData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Analytics & Reports</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm font-medium"
            >
              Clear Today's Data
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors text-sm font-medium"
            >
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-lg border border-blue-100 dark:border-blue-800 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-blue-600 dark:text-blue-400" size={20} />
              <h3 className="font-semibold text-gray-800 dark:text-white">Today's Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Served:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.totalServed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">In Queue:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.currentQueueCount}/{stats.queueCapacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">In Mess:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.currentMessCount}/{stats.messCapacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Peak Time:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.peakTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-6 rounded-lg border border-green-100 dark:border-green-800 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-green-600 dark:text-green-400" size={20} />
              <h3 className="font-semibold text-gray-800 dark:text-white">Wait Time Analysis</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Average Wait:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.averageWaitTime} min total</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Est. Queue Wait:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.estimatedWaitTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Throughput:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {stats.averageWaitTime > 0 ? Math.round(60 / stats.averageWaitTime) : 0} students/hour
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}