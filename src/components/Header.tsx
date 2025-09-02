
import { ChefHat, Activity, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

interface HeaderProps {
  currentTime: Date;
}

export function Header({ currentTime }: HeaderProps) {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <ChefHat className="text-blue-600 dark:text-blue-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Smart Mess Queue Manager</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">VITB University Dining Hall</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Project by Group- 235</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="text-yellow-500" size={20} />
              ) : (
                <Moon className="text-gray-600" size={20} />
              )}
            </button>
            
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-lg">
              <Activity className="text-green-600 dark:text-green-400" size={16} />
              <span className="text-green-700 dark:text-green-300 font-medium text-sm">System Online</span>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {currentTime.toLocaleDateString()}
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}