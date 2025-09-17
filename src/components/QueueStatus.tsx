
import { Users, Clock, TrendingUp, Activity, Building2 } from 'lucide-react';
import { QueueStats } from '../types';

interface QueueStatusProps {
  stats: QueueStats;
}

export function QueueStatus({ stats }: QueueStatusProps) {
  const getWaitTimeColor = (waitTime: number) => {
    if (waitTime <= 5) return 'text-green-600 bg-green-50 border-green-200';
    if (waitTime <= 15) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getQueueStatusColor = (queueLength: number, capacity: number) => {
    const ratio = queueLength / capacity;
    if (ratio <= 0.5) return 'text-green-600';
    if (ratio <= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMessStatusColor = (messCount: number, capacity: number) => {
    const ratio = messCount / capacity;
    if (ratio <= 0.6) return 'text-green-600';
    if (ratio <= 0.85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Queue</p>
            <p className={`text-3xl font-bold ${getQueueStatusColor(stats.currentQueueCount, stats.queueCapacity)}`}>
              {stats.currentQueueCount}/{stats.queueCapacity}
            </p>
          </div>
          <Users className="text-blue-500 dark:text-blue-400" size={32} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Waiting to enter</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Mess</p>
            <p className={`text-3xl font-bold ${getMessStatusColor(stats.currentMessCount, stats.messCapacity)}`}>
              {stats.currentMessCount}/{stats.messCapacity}
            </p>
          </div>
          <Building2 className="text-orange-500 dark:text-orange-400" size={32} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Currently inside</p>
      </div>

      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border ${getWaitTimeColor(stats.estimatedWaitTime).split(' ')[2]} transition-colors`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Est. Wait Time</p>
            <p className={`text-3xl font-bold ${getWaitTimeColor(stats.estimatedWaitTime).split(' ')[0]}`}>
              {stats.estimatedWaitTime}m
            </p>
          </div>
          <Clock className={getWaitTimeColor(stats.estimatedWaitTime).split(' ')[0].replace('text-', '')} size={32} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">For queue joiners</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg. Wait Time</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.averageWaitTime}m</p>
          </div>
          <TrendingUp className="text-green-500 dark:text-green-400" size={32} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total time avg</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Served</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalServed}</p>
          </div>
          <Activity className="text-purple-500 dark:text-purple-400" size={32} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Completed today</p>
      </div>
    </div>
  );
}