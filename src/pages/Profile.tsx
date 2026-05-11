import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import { User, Mail, Lock, Sun, Moon, CheckCircle, AlertCircle, Save } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile info state
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileStatus(null);

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username, email })
      });

      const data = await response.json();

      if (response.ok) {
        setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
        if (setUser) setUser({ id: data.user.id, username: data.user.username, email: data.user.email });
      } else {
        setProfileStatus({ type: 'error', message: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setProfileStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    setIsPasswordLoading(true);
    setPasswordStatus(null);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: data.message || 'Failed to change password' });
      }
    } catch (error) {
      setPasswordStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl shadow-blue-600/5 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Left: Sidebar Identity */}
            <div className="md:w-1/3 bg-gray-50/50 dark:bg-gray-900/30 p-10 flex flex-col items-center border-r border-gray-100 dark:border-gray-800">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-xl mb-6">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{user?.username}</h2>
              <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-8">Premium User</p>

              <div className="w-full space-y-3">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <span className="flex items-center gap-3 font-bold text-gray-600 dark:text-gray-300">
                    <Sun size={18} /> Appearance
                  </span>
                  <button onClick={toggleTheme} className="p-1.5 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Boxed Forms */}
            <div className="md:w-2/3 p-10 space-y-12">
              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <User size={14} className="text-blue-600" /> Account Details
                </h3>

                {profileStatus && (
                  <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${profileStatus.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                    <CheckCircle size={18} /> <span className="font-bold">{profileStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email (Locked)</label>
                      <div className="relative">
                        <input
                          type="email"
                          readOnly
                          value={email}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-100/50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 text-gray-400 font-bold cursor-not-allowed outline-none"
                        />
                        <Lock size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                    Update Profile
                  </button>
                </form>
              </section>

              <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>

              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <Lock size={14} className="text-emerald-500" /> Password
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-inner"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-inner"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95">
                    Save New Password
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
