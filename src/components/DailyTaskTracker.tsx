import { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Check, Lock, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import AddTaskModal from './AddTaskModal';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface DayInfo {
  dayNumber: number;
  dayName: string;
  date: string;
  isToday: boolean;
}

interface DailyTaskTrackerProps {
  showManagement?: boolean;
}

export default function DailyTaskTracker({ showManagement = false }: DailyTaskTrackerProps) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(() => today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => today.getMonth());
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string, title: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { tasks, loading, addTask, deleteTask, toggleCompletion, isCompleted, getDayStatus } = useTasks(viewYear, viewMonth);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysInMonth = useMemo(() => {
    const count = new Date(viewYear, viewMonth + 1, 0).getDate();
    const result: DayInfo[] = [];
    for (let d = 1; d <= count; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      result.push({
        dayNumber: d,
        dayName: DAY_LABELS[date.getDay()],
        date: dateStr,
        isToday: date.getTime() === todayMidnight.getTime()
      });
    }
    return result;
  }, [viewYear, viewMonth, today]);

  const handleDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 flex flex-col transition-colors duration-300">
      {/* Top Bar */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
          
          {/* Left: Month & Year Selector */}
          <div className="flex-1 flex items-center justify-center sm:justify-start w-full sm:w-auto">
            <div className="flex items-center gap-3 group cursor-pointer bg-gray-50 dark:bg-gray-900/50 px-3 md:px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 w-full sm:w-auto justify-center">
              <CalendarIcon size={18} className="text-blue-600 dark:text-blue-400" />
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value))}
                className="bg-transparent text-sm md:text-base font-black text-gray-900 dark:text-white outline-none cursor-pointer hover:text-blue-600 transition-colors appearance-none"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i}>{name.substring(0, 3)}</option>
                ))}
              </select>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value))}
                className="bg-transparent text-xs md:text-sm font-black text-gray-400 dark:text-gray-500 outline-none cursor-pointer hover:text-blue-600 transition-colors appearance-none"
              >
                {Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Center: Motivation Quote (Hidden on small mobile, visible on Tab/Desktop) */}
          <div className="hidden sm:flex flex-[3] flex-col items-center px-4 text-center min-w-0">
            <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] mb-1.5">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.4)]"></span>
              Mindset
            </div>
            <p className="text-sm md:text-xl font-black text-gray-800 dark:text-white italic tracking-tight leading-tight max-w-full drop-shadow-sm">
              "Discipline is the bridge between goals and accomplishment."
            </p>
          </div>

          {/* Right: Date, Time & Add Button */}
          <div className="flex-1 flex items-center justify-center sm:justify-end gap-4 md:gap-6 w-full sm:w-auto">
            <div className="flex flex-col items-center sm:items-end bg-gray-50/50 dark:bg-gray-900/30 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 text-gray-900 dark:text-white text-base md:text-xl font-black tracking-tighter">
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <div className="text-[8px] md:text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            
            {showManagement && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex-shrink-0"
                title="Add Habit"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto bg-gray-50/10 dark:bg-gray-900/10">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-900/80">
              <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-900 p-4 text-left border-b border-r border-gray-200 dark:border-gray-700 min-w-[200px]">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Habit List</span>
              </th>
              {daysInMonth.map(day => (
                <th
                  key={day.date}
                  className={`p-2 border-b border-r border-gray-200 dark:border-gray-700 min-w-[44px] ${day.isToday ? 'bg-blue-100/30 dark:bg-blue-900/40' : ''
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{day.dayName}</span>
                    <span className={`text-xs font-black ${day.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {day.dayNumber}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={daysInMonth.length + 1} className="p-10 text-center text-gray-400">Loading your habits...</td></tr>
            ) : tasks.length === 0 ? (
              <tr><td colSpan={daysInMonth.length + 1} className="p-10 text-center text-gray-400">No habits tracked for this period.</td></tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: task.color }} />
                        <span className="font-bold text-gray-700 dark:text-gray-200 truncate">{task.title}</span>
                      </div>
                      {showManagement && (
                        <button
                          onClick={() => setTaskToDelete({ id: task.id, title: task.title })}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                  {daysInMonth.map(day => {
                    const completed = isCompleted(task.id, day.date);
                    const status = getDayStatus(day.date);
                    return (
                      <td key={day.date} className={`p-2 text-center border-r border-gray-100 dark:border-gray-800 ${day.isToday ? 'bg-blue-50/10 dark:bg-blue-900/10' : ''}`}>
                        <button
                          onClick={() => toggleCompletion(task.id, day.date)}
                          disabled={status === 'disabled'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all ${completed
                            ? 'text-white shadow-md'
                            : day.isToday
                              ? 'border-2 border-blue-800 bg-blue-100 dark:bg-blue-900/60 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                              : status === 'locked'
                                ? 'border-2 border-gray-500 dark:border-gray-500 bg-gray-200/50 dark:bg-gray-800/40'
                                : 'border-2 border-gray-500 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/40'
                            } ${status === 'editable' ? 'hover:scale-110 active:scale-95 cursor-pointer hover:border-blue-500' : 'cursor-not-allowed opacity-40'}`}
                          style={{ backgroundColor: completed ? task.color : undefined }}
                        >
                          {completed ? <Check size={16} strokeWidth={4} /> : status === 'locked' ? <Lock size={12} className="text-gray-300 dark:text-gray-600" /> : null}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && <AddTaskModal onAdd={addTask} onClose={() => setShowModal(false)} />}
    </div>
  );
}
