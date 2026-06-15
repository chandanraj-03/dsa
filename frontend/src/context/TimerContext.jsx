import React, { createContext, useState, useEffect, useContext } from 'react';

const TimerContext = createContext(null);

export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFocus, setIsFocus] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto switch modes and pause
      setIsActive(false);
      if (isFocus) {
        setIsFocus(false);
        setTimeLeft(5 * 60);
      } else {
        setIsFocus(true);
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isFocus]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isFocus ? 25 * 60 : 5 * 60);
  };

  const switchMode = (mode) => {
    setIsActive(false);
    setIsFocus(mode === 'focus');
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContext.Provider
      value={{
        timeLeft,
        isActive,
        isFocus,
        toggleTimer,
        resetTimer,
        switchMode,
        formatTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
