
import { BarChart3, Download, Users, Clock } from 'lucide-react';
import { storage } from '../utils/storage';

export function Analytics() {
  const history = storage.getHistory();
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
                <span className="text-gray-600 dark:text-gray-300">Currently Waiting:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.currentQueue}</span>
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
                <span className="font-semibold text-gray-800 dark:text-white">{stats.averageWaitTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Estimated Wait:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.estimatedWaitTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Service Rate:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {stats.averageWaitTime > 0 ? Math.round(60 / stats.averageWaitTime) : 0} students/hour
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Historical Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Students Served</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Avg Wait Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Peak Hour</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(-7).map((day, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{new Date(day.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{day.totalStudents}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{day.averageWaitTime} min</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{day.peakHour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}