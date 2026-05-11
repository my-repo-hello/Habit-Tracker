import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import DailyTaskTracker from '../components/DailyTaskTracker';

export const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full flex flex-col max-w-8xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Here's your daily progress and upcoming tasks.</p>
        </div>

        {/* The Habit Tracker */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col min-h-0">
          <DailyTaskTracker showManagement={false} />
        </div>
      </main>
    </div>
  );
};
