import React, { useState, useEffect } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval, addDays 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, ListTodo } from 'lucide-react';
import api from '../api';

const Schedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [revisions, setRevisions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTaskDates, setCompletedTaskDates] = useState({});
  const [currentDay, setCurrentDay] = useState(1);
  const [todayDate] = useState(new Date()); // Keep a static today date for mapping
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, allTasksRes, revRes] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/tasks/all'),
        api.get('/revisions/upcoming')
      ]);
      setCurrentDay(dashRes.data.current_day || 1);
      setCompletedTaskDates(dashRes.data.completed_task_dates || {});
      setTasks(allTasksRes.data || []);
      setRevisions(revRes.data || []);
    } catch (error) {
      console.error("Failed to fetch data for calendar", error);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const onDateClick = (day) => setSelectedDate(day);

  // Generate days for the calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Map revisions to dates (using the due_date field)
  const getRevisionsForDay = (day) => {
    return revisions.filter(rev => {
      if (!rev.due_date) return false;
      return isSameDay(new Date(rev.due_date), day);
    });
  };

  // Map tasks to dates using offset from currentDay or completed date
  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      let taskDate;
      const completedDateIso = completedTaskDates[task.id];
      if (completedDateIso) {
        taskDate = new Date(completedDateIso);
      } else {
        taskDate = addDays(todayDate, task.day - currentDay);
      }
      return isSameDay(taskDate, day);
    });
  };

  const selectedDayRevisions = getRevisionsForDay(selectedDate);
  const selectedDayTasks = getTasksForDay(selectedDate);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-100 dark:bg-primary-500/20 p-2 rounded-xl text-primary-600 dark:text-primary-400">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors duration-200">
            Schedule
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-200">
            Track your tasks and upcoming revisions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-slate-600 dark:text-slate-300 rounded-lg transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1.5 text-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-500/20 dark:text-primary-400 dark:hover:bg-primary-500/30 rounded-lg transition-all">
                Today
              </button>
              <button onClick={nextMonth} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-slate-600 dark:text-slate-300 rounded-lg transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold text-xs text-slate-500 dark:text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const revs = getRevisionsForDay(day);
              const dayTasks = getTasksForDay(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              
              const events = [
                ...dayTasks.map(t => ({ ...t, eventType: 'task' })),
                ...revs.map(r => ({ ...r, eventType: 'revision' }))
              ];

              return (
                <div 
                  key={idx} 
                  onClick={() => onDateClick(day)}
                  className={`min-h-[80px] p-2 rounded-xl cursor-pointer transition-all border ${
                    !isCurrentMonth ? 'opacity-40 bg-slate-50/50 dark:bg-dark-900/50 border-transparent' : 
                    isSelected ? 'border-primary-500 shadow-md shadow-primary-500/10 bg-white dark:bg-dark-800 ring-2 ring-primary-500/20' : 
                    isToday ? 'border-amber-500/50 bg-amber-50/30 dark:bg-amber-500/5' :
                    'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-dark-800 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-amber-600 dark:text-amber-400' : 
                    isSelected ? 'text-primary-600 dark:text-primary-400' :
                    'text-slate-700 dark:text-slate-300'
                  }`}>
                    {format(day, dateFormat)}
                  </div>
                  <div className="flex flex-col gap-1">
                    {events.slice(0, 2).map((evt, i) => {
                      if (evt.eventType === 'task') {
                        const isCompleted = !!completedTaskDates[evt.id];
                        return (
                          <div key={`task-${i}`} className={`text-[10px] truncate px-1.5 py-0.5 rounded-md border ${
                            isCompleted ? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-dark-700 dark:text-slate-400 dark:border-dark-600 line-through' : 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-500/20 dark:text-primary-400 dark:border-primary-500/30'
                          }`}>
                            Task: {evt.title}
                          </div>
                        );
                      } else {
                        return (
                          <div key={`rev-${i}`} className="text-[10px] truncate px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                            Rev: {evt.topic || 'Revision'}
                          </div>
                        );
                      }
                    })}
                    {events.length > 2 && (
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 mt-0.5 font-medium">
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="glass-panel p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {(selectedDayTasks.length > 0 || selectedDayRevisions.length > 0) ? (
              <div className="space-y-6">
                {selectedDayTasks.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tasks Scheduled</h3>
                    {selectedDayTasks.map((task, idx) => {
                      const isCompleted = !!completedTaskDates[task.id];
                      return (
                        <div key={`task-${idx}`} className={`p-4 rounded-xl border transition-all ${
                          isCompleted ? 'border-slate-200 bg-slate-50 dark:border-dark-600 dark:bg-dark-800/50' : 'border-primary-500/30 bg-primary-50/50 dark:bg-primary-500/5 hover:border-primary-500/50'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                              isCompleted ? 'bg-slate-200 text-slate-600 dark:bg-dark-700 dark:text-slate-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                            }`}>
                              {isCompleted ? <CheckCircle2 size={12} /> : <ListTodo size={12} />}
                              Task (Day {task.day}) {isCompleted && '- Completed'}
                            </span>
                          </div>
                          <h4 className={`font-medium mb-1 ${isCompleted ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>{task.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{task.topic}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedDayRevisions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Revisions Due</h3>
                    {selectedDayRevisions.map((rev, idx) => (
                      <div key={`rev-${idx}`} className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 hover:border-emerald-500/50 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center gap-1">
                            <Clock size={12} />
                            Revision
                          </span>
                        </div>
                        <h4 className="font-medium text-slate-800 dark:text-white mb-1">{rev.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{rev.topic}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 opacity-60">
                <CheckCircle2 size={48} className="mb-4" />
                <p>No events scheduled for this day.</p>
                <p className="text-sm mt-1">Enjoy your free time or get ahead!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
