import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Flame, Target, CalendarClock, ChevronRight, CheckCircle2, Circle, FileText, Undo2 } from 'lucide-react';
import { format } from 'date-fns';
import NotesModal from '../components/NotesModal';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState({});
  const [completedIds, setCompletedIds] = useState(new Set());
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashRes, tasksRes] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/tasks/all')
      ]);
      setData(dashRes.data);
      
      const currentDay = dashRes.data.current_day;
      const filteredTasks = tasksRes.data.filter(t => t.day === currentDay);
      setTodayTasks(filteredTasks);
      
      // Track which tasks are already completed
      setCompletedIds(new Set(dashRes.data.completed_task_ids || []));
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (taskId) => {
    setCompleting(prev => ({ ...prev, [taskId]: true }));
    try {
      await api.post('/progress/complete', { task_id: taskId });
      fetchDashboard();
    } catch (error) {
      console.error(error);
    } finally {
      setCompleting(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const undoComplete = async (taskId) => {
    setCompleting(prev => ({ ...prev, [taskId]: true }));
    try {
      await api.post('/progress/uncomplete', { task_id: taskId });
      fetchDashboard();
    } catch (error) {
      console.error(error);
    } finally {
      setCompleting(prev => ({ ...prev, [taskId]: false }));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const openNotes = (task) => {
    setActiveTask(task);
    setNotesModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-2 relative z-10">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Flame className="text-orange-500" size={24} />
            </div>
            <div>
              <h3 className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Current Streak</h3>
              <div className="text-3xl font-bold text-slate-800 dark:text-white flex items-baseline gap-1 transition-colors">
                {data?.streak} <span className="text-sm font-normal text-slate-400 dark:text-slate-500">days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-2 relative z-10">
            <div className="p-3 bg-primary-500/20 rounded-xl">
              <Target className="text-primary-400" size={24} />
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Course Progress</h3>
                <span className="text-primary-600 dark:text-primary-400 font-bold transition-colors">{data?.progress_percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-dark-900 rounded-full h-2.5 mt-2 transition-colors duration-200">
                <div className="bg-primary-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${data?.progress_percentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <CalendarClock className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Revisions Due</h3>
                <div className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">
                  {data?.upcoming_revisions_count}
                </div>
              </div>
            </div>
            {data?.upcoming_revisions_count > 0 && (
              <Link to="/revisions" className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-dark-900 dark:hover:bg-slate-800 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all">
                <ChevronRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 transition-colors">
              <div className="w-2 h-8 bg-primary-500 rounded-full"></div>
              Day {data?.current_day} Tasks
            </h2>
            <Link to="/roadmap" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium flex items-center transition-colors">
              View full roadmap <ChevronRight size={16} />
            </Link>
          </div>

          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="glass-panel p-8 text-center text-slate-500 dark:text-slate-400">
                <p>No tasks for today. You might have finished everything!</p>
              </div>
            ) : (
              todayTasks.map(task => {
                const isCompleted = completedIds.has(task.id);
                return (
                  <div key={task.id} className={`glass-panel p-4 flex items-center justify-between group transition-all ${isCompleted ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/5' : 'hover:border-primary-500/50'}`}>
                    <div className={isCompleted ? 'opacity-70' : ''}>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          task.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20' :
                          task.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {task.difficulty}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{task.topic}</span>
                        {task.leetcode_number && task.leetcode_link && (
                          <a 
                            href={task.leetcode_link} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center"
                          >
                            LC #{task.leetcode_number}
                          </a>
                        )}
                      </div>
                      <h3 className={`font-medium text-lg transition-colors ${isCompleted ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>{task.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{task.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => openNotes(task)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all group-hover:scale-110"
                        title="Notes"
                      >
                        <FileText size={20} />
                      </button>
                      {isCompleted ? (
                        <button 
                          onClick={() => undoComplete(task.id)}
                          disabled={completing[task.id]}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all disabled:opacity-50"
                          title="Undo completion"
                        >
                          {completing[task.id] ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <CheckCircle2 size={18} />
                              <span className="hidden sm:inline">Done</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button 
                          onClick={() => markCompleted(task.id)}
                          disabled={completing[task.id]}
                          className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all group-hover:scale-110 disabled:opacity-50"
                          title="Mark complete"
                        >
                          {completing[task.id] ? (
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Circle size={28} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Up Next / Revisions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 transition-colors">
             <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
             Due Revisions
          </h2>
          
          <div className="glass-panel p-5">
            {data?.upcoming_revisions?.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-400">
                <CalendarClock size={48} className="mx-auto mb-3 opacity-20" />
                <p>No revisions due right now.</p>
                <p className="text-sm mt-1">Keep learning!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data?.upcoming_revisions?.map((rev, idx) => (
                  <div key={idx} className="flex flex-col border-b border-slate-200 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
                    <span className="text-xs text-emerald-500 dark:text-emerald-400 font-medium mb-1">Due: {format(new Date(rev.due_date), 'MMM dd')}</span>
                    <span className="text-slate-800 dark:text-white font-medium transition-colors">{rev.title}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">{rev.topic}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <NotesModal 
        isOpen={notesModalOpen} 
        onClose={() => setNotesModalOpen(false)} 
        taskId={activeTask?.id} 
        taskTitle={activeTask?.title} 
      />
    </div>
  );
};

export default Dashboard;
