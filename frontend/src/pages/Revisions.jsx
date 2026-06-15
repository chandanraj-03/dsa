import React, { useState, useEffect } from 'react';
import api from '../api';
import { CalendarClock, AlertCircle, FileText, Check, Loader2 } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import NotesModal from '../components/NotesModal';

const Revisions = () => {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [reviewing, setReviewing] = useState({});

  const openNotes = (rev) => {
    setActiveTask({ id: rev.task_id, title: rev.title });
    setNotesModalOpen(true);
  };

  const fetchRevisions = async () => {
    try {
      const res = await api.get('/revisions/upcoming');
      setRevisions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const markReviewed = async (rev, quality) => {
    const key = `${rev.task_id}-${rev.due_date}`;
    setReviewing(prev => ({ ...prev, [key]: true }));
    try {
      await api.post('/revisions/mark-reviewed', {
        task_id: rev.task_id,
        quality: quality
      });
      // Remove from the list optimistically
      setRevisions(prev => prev.filter(r => !(r.task_id === rev.task_id && r.due_date === rev.due_date)));
    } catch (error) {
      console.error('Failed to mark as reviewed:', error);
    } finally {
      setReviewing(prev => ({ ...prev, [key]: false }));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-500/20 rounded-xl">
          <CalendarClock className="text-emerald-400" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">Spaced Repetition</h1>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">Review these topics to cement them in long-term memory.</p>
        </div>
      </div>

      {revisions.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors">
            <AlertCircle size={40} className="text-slate-400 dark:text-slate-600" />
          </div>
          <h2 className="text-xl font-medium text-slate-800 dark:text-white mb-2 transition-colors">You're all caught up!</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md transition-colors">
            No revisions due right now. Revisions are automatically scheduled 3, 7, and 14 days after you complete a topic.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {revisions.map((rev, idx) => {
            const date = new Date(rev.due_date);
            const past = isPast(date) && !isToday(date);
            const today = isToday(date);
            const key = `${rev.task_id}-${rev.due_date}`;
            
            return (
              <div key={idx} className="glass-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-emerald-500">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      past ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400' : 
                      today ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400' : 
                      'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                    }`}>
                      {past ? 'Overdue' : today ? 'Due Today' : 'Upcoming'}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">{format(date, 'MMM dd, yyyy')}</span>
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-white transition-colors">{rev.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{rev.topic}</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button 
                    onClick={() => openNotes(rev)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all"
                    title="Review Notes"
                  >
                    <FileText size={20} />
                  </button>
                  {reviewing[key] ? (
                    <div className="flex items-center justify-center w-[164px] h-[36px]">
                      <Loader2 size={20} className="animate-spin text-primary-500" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-dark-900 p-1 rounded-xl">
                      <button 
                        onClick={() => markReviewed(rev, 1)}
                        className="px-3 py-1.5 text-xs font-medium bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30 rounded-lg transition-colors"
                        title="Hard: I struggled to remember"
                      >
                        Hard
                      </button>
                      <button 
                        onClick={() => markReviewed(rev, 3)}
                        className="px-3 py-1.5 text-xs font-medium bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 rounded-lg transition-colors"
                        title="Good: Remembered with some effort"
                      >
                        Good
                      </button>
                      <button 
                        onClick={() => markReviewed(rev, 5)}
                        className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 rounded-lg transition-colors"
                        title="Easy: Perfect recall"
                      >
                        Easy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <NotesModal 
        isOpen={notesModalOpen} 
        onClose={() => setNotesModalOpen(false)} 
        taskId={activeTask?.id} 
        taskTitle={activeTask?.title} 
      />
    </div>
  );
};

export default Revisions;
