import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Settings as SettingsIcon, User, Lock, Bell, Moon, Sun, Save, CheckCircle2 } from 'lucide-react';
import api from '../api';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    dailyReminders: false,
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;
    
    setDeleting(true);
    try {
      await api.delete('/auth/account');
      logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to delete account", error);
      alert("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'account', label: 'Account', icon: <Lock size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary-100 dark:bg-primary-500/20 p-2.5 rounded-xl text-primary-600 dark:text-primary-400">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors duration-200">
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-200">
            Manage your account preferences and configurations
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 glass-panel p-6 md:p-8">
          <form onSubmit={handleSave}>
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Profile Information</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-primary-500/20">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <button type="button" className="px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Account Security</h2>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-2">Danger Zone</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Permanently delete your account and all of your content.</p>
                  <button 
                    type="button" 
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="px-4 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-lg transition-colors border border-rose-200 dark:border-rose-500/20 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</h3>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => theme !== 'light' && toggleTheme()}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                          theme === 'light' 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-700' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Sun size={20} className={theme === 'light' ? 'text-primary-500' : ''} />
                        Light Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                          theme === 'dark' 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-400' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-600 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Moon size={20} className={theme === 'dark' ? 'text-primary-400' : ''} />
                        Dark Mode
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-start pt-0.5">
                      <input 
                        type="checkbox" 
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        className="peer sr-only" 
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-all flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">Email Notifications</span>
                      <span className="block text-sm text-slate-500 dark:text-slate-400">Receive email updates about your progress and new features.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-start pt-0.5">
                      <input 
                        type="checkbox" 
                        name="dailyReminders"
                        checked={formData.dailyReminders}
                        onChange={handleChange}
                        className="peer sr-only" 
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-all flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">Daily Reminders</span>
                      <span className="block text-sm text-slate-500 dark:text-slate-400">Get a daily summary of your due revisions and pending tasks.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white transition-all ${
                  saved 
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30' 
                    : 'bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-600/30'
                } disabled:opacity-70`}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : saved ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Save size={20} />
                )}
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Settings;
