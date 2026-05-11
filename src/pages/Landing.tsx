import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Landing: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-xl shadow-inner shadow-blue-800/30">
            <img src="/icon.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
            Habit Tracker
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
            Create Profile
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Build better habits, <br />
              <span className="text-blue-600">Day one, one day.</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
              The simple, intuitive way to track your daily routines and build a lifestyle you love. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/signup" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30 text-lg w-full sm:w-auto justify-center">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl transform rotate-3 scale-105 opacity-50 blur-xl"></div>
              <img
                src="https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Productivity"
                className="relative rounded-3xl shadow-2xl border border-gray-100 object-cover w-full h-[400px]"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
