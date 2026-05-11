import { useState, useEffect, useRef } from 'react';
import { Sparkles, User as UserIcon, Settings, LogOut, ChevronDown, UserCircle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';

const MOTIVATIONS = [
  "Every task completed is a step towards greatness!",
  "You're building better habits today!",
  "Progress over perfection. Keep going!",
  "Small wins lead to big achievements!",
  "Today is your chance to be better!",
  "Consistency is the key to success!",
  "You've got this! Stay focused!",
  "Make today count!",
  "Your future self will thank you!",
  "One day at a time. You're unstoppable!"
];

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState<string>('');
  const [motivation, setMotivation] = useState<string>(MOTIVATIONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMotivation(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Branding */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 group-hover:rotate-12 transition-transform duration-300">
              <img src="/icon.png" alt="Logo" className="w-9 h-9 object-contain rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
                Habit <span className="text-blue-600">Tracker</span>
              </span>
            </div>
          </Link>

          {/* Right: User Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 pr-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs border-2 border-white dark:border-gray-800 shadow-sm">
                  {user?.username?.charAt(0).toUpperCase() || <UserIcon size={16} />}
                </div>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{user?.username}</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Account</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 mb-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <UserCircle size={18} />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                  <div className="my-2 border-t border-gray-50 dark:border-gray-700"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
