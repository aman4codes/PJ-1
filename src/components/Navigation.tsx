import { QrCode, BarChart3, Users, Home } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'scanner', label: 'QR Scanner', icon: QrCode },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}