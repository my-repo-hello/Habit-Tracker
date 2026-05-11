import React, { useState } from 'react';
import Header from '../components/Header';
import { useTasks } from '../hooks/useTasks';
import { Settings as SettingsIcon, Info, Trash2, Plus, AlertTriangle, ListChecks } from 'lucide-react';
import AddTaskModal from '../components/AddTaskModal';

export default function Settings() {
  const { tasks, addTask, deleteTask } = useTasks(new Date().getFullYear(), new Date().getMonth());
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string, title: string } | null>(null);

  const confirmDelete = (task: { id: string, title: string }) => {
    setTaskToDelete(task);
  };

  const handleDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full flex flex-col max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
                <ListChecks className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Manage Habits
              </h1>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={20} />
              Add Habit
            </button>
          </div>
          <div className="flex items-start gap-3 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Add the habits you want to track daily. You can customize the colors and names here.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
             <span className="text-xs font-black uppercase tracking-widest text-gray-400">Current Habits ({tasks.length})</span>
          </div>
          
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {tasks.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 dark:text-gray-500 font-medium">You haven't added any habits yet.</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div key={task.id} className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-4">{index + 1}</span>
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: task.color }}
                    />
                    <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{task.title}</span>
                  </div>
                  <button
                    onClick={() => confirmDelete({ id: task.id, title: task.title })}
                    className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                    title="Remove Habit"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-sm w-full p-8 scale-in-center">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-2.5 rounded-2xl">
                   <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Remove?</h3>
             </div>
             <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
                Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">"{taskToDelete.title}"</span>? This action cannot be undone.
             </p>
             <div className="flex gap-3">
                <button 
                   onClick={() => setTaskToDelete(null)}
                   className="flex-1 px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                   Cancel
                </button>
                <button 
                   onClick={handleDelete}
                   className="flex-1 px-4 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg shadow-red-600/20"
                >
                   Remove
                </button>
             </div>
          </div>
        </div>
      )}

      {showModal && (
        <AddTaskModal
          onAdd={addTask}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
