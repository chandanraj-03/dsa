import React from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { useTimer } from '../context/TimerContext';

const FocusMode = () => {
  const { 
    timeLeft, 
    isActive, 
    isFocus, 
    toggleTimer, 
    resetTimer, 
    switchMode, 
    formatTime 
  } = useTimer();

  const progress = isFocus 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="glass-panel p-8 md:p-12 max-w-md w-full flex flex-col items-center relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${isFocus ? 'bg-primary-500' : 'bg-emerald-500'}`} />
        
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 relative z-10 transition-colors">
          {isFocus ? 'Focus Mode' : 'Take a Break'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 relative z-10 text-center transition-colors">
          {isFocus ? 'Concentrate on your tasks and study materials.' : 'Relax and recharge for a few minutes.'}
        </p>

        <div className="flex bg-slate-100 dark:bg-dark-900 p-1 rounded-xl mb-8 relative z-10 transition-colors">
          <button
            onClick={() => switchMode('focus')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${isFocus ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Brain size={18} /> Focus
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${!isFocus ? 'bg-white dark:bg-dark-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Coffee size={18} /> Break
          </button>
        </div>

        {/* Circular Progress Timer */}
        <div className="relative w-64 h-64 mb-10 flex items-center justify-center z-10">
          <svg className="w-full h-full transform -rotate-90 absolute inset-0">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-slate-800 transition-colors"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className={`transition-all duration-1000 ease-linear ${isFocus ? 'text-primary-500' : 'text-emerald-500'}`}
            />
          </svg>
          <div className="text-6xl font-bold font-mono tracking-tighter text-slate-800 dark:text-white transition-colors">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={toggleTimer}
            className={`flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isFocus ? 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'}`}
          >
            {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <button
            onClick={resetTimer}
            className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-dark-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all active:scale-95"
            title="Reset"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
