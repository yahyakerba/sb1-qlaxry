import { Moon, Sun, Monitor, Settings } from 'lucide-react';
import { useState } from 'react';
import { useThemeStore } from '../store/themeStore';

export function SettingsPanel() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Theme
            </h3>
            <div className="mt-4 space-y-2">
              {themes.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id as 'light' | 'dark' | 'system')}
                  className={`
                    flex items-center w-full px-3 py-2 text-sm rounded-md
                    ${theme === id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}