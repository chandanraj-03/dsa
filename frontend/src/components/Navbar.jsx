import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Flame, LayoutDashboard, Map, BarChart2, CalendarClock, BookOpen, LogOut, Sun, Moon, Menu, X, Timer, Calendar, Settings, Mic } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Roadmap', path: '/roadmap', icon: <Map size={18} /> },
    { name: 'Progress', path: '/progress', icon: <BarChart2 size={18} /> },
    { name: 'Revisions', path: '/revisions', icon: <CalendarClock size={18} /> },
    { name: 'Schedule', path: '/schedule', icon: <Calendar size={18} /> },
    { name: 'Interview Prep', path: '/interview-prep', icon: <BookOpen size={18} /> },
    { name: 'Focus Mode', path: '/focus-mode', icon: <Timer size={18} /> },
    { name: 'Speak Test', path: '/try-to-speak', icon: <Mic size={18} /> },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/60 dark:bg-dark-900/50 backdrop-blur-xl border-b border-white/40 dark:border-slate-700/40 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800 dark:text-white transition-colors duration-200">
              <div className="bg-primary-600 p-1.5 rounded-lg shadow-lg shadow-primary-600/30">
                <Flame size={20} className="text-white" />
              </div>
              PlacementPrep
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <NavLink 
              to="/settings"
              className="hidden xl:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors group cursor-pointer"
            >
              <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Welcome, </span>
              <span className="text-slate-800 dark:text-slate-200 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{user?.name}</span>
            </NavLink>


            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={closeMobile}
          />

          {/* Slide-in panel */}
          <nav className="absolute top-16 right-0 w-64 bg-white dark:bg-dark-800 border-l border-slate-200 dark:border-slate-700 shadow-2xl h-[calc(100vh-4rem)] flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Signed in as <span className="text-slate-800 dark:text-white font-medium">{user?.name}</span>
              </p>
            </div>

            <div className="flex-1 p-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
              <NavLink
                to="/settings"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                <Settings size={18} />
                Settings
              </NavLink>
              <button
                onClick={() => { handleLogout(); closeMobile(); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
