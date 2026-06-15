import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { Lock, CheckCircle2, ChevronRight, Play, LayoutGrid, Network, Search, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import DSAMindMap from '../components/DSAMindMap';

const Roadmap = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('mindmap'); // 'grid' or 'mindmap'
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // all, Easy, Medium, Hard
  const [statusFilter, setStatusFilter] = useState('all'); // all, completed, current, locked
  const [currentDay, setCurrentDay] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allTasksRes, dashRes] = await Promise.all([
        api.get('/tasks/all'),
        api.get('/dashboard/overview')
      ]);
      
      const allTasks = allTasksRes.data;
      const currentDay = dashRes.data.current_day;
      setCurrentDay(currentDay);
      
      const grouped = {};
      allTasks.forEach(t => {
        if (!grouped[t.day]) {
          grouped[t.day] = {
            day: t.day,
            topic: t.topic,
            tasks: [],
            isCompleted: t.day < currentDay,
            isCurrent: t.day === currentDay,
            isLocked: t.day > currentDay
          };
        }
        grouped[t.day].tasks.push(t);
      });
      
      setTasks(Object.values(grouped).sort((a,b) => a.day - b.day));
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(dayData => {
      // Search filter — match topic or any task title
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTopic = dayData.topic.toLowerCase().includes(query);
        const matchesTask = dayData.tasks.some(t => 
          t.title.toLowerCase().includes(query) || 
          (t.leetcode_number && t.leetcode_number.toString().includes(query))
        );
        const matchesDay = `day ${dayData.day}`.includes(query) || dayData.day.toString() === query;
        if (!matchesTopic && !matchesTask && !matchesDay) return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'all') {
        const hasMatchingDifficulty = dayData.tasks.some(t => t.difficulty === difficultyFilter);
        if (!hasMatchingDifficulty) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'completed' && !dayData.isCompleted) return false;
        if (statusFilter === 'current' && !dayData.isCurrent) return false;
        if (statusFilter === 'locked' && !dayData.isLocked) return false;
      }

      return true;
    });
  }, [tasks, searchQuery, difficultyFilter, statusFilter]);

  const hasActiveFilters = searchQuery || difficultyFilter !== 'all' || statusFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setStatusFilter('all');
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 transition-colors duration-200">DSA Roadmap</h1>
          <p className="text-slate-500 dark:text-slate-400 transition-colors duration-200">Your structured path to placement preparation. Follow the schedule, build consistency.</p>
        </div>
        
        <div className="flex bg-slate-200/50 dark:bg-dark-800 p-1 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors duration-200 shrink-0">
          <button 
            onClick={() => setViewMode('mindmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'mindmap' ? 'bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <Network size={16} /> Mind Map
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <LayoutGrid size={16} /> Timeline Grid
          </button>
        </div>
      </div>

      {viewMode === 'mindmap' ? (
        <DSAMindMap />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="glass-panel p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by topic, problem name, or day..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9 pr-8 text-sm"
                  id="roadmap-search"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Difficulty Filter */}
              <div className="flex gap-2">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="input-field text-sm w-auto min-w-[120px]"
                  id="difficulty-filter"
                >
                  <option value="all">All Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field text-sm w-auto min-w-[120px]"
                  id="status-filter"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="current">Current</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <Filter size={14} className="text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {filteredTasks.length} of {tasks.length} days
                </span>
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-500 hover:text-primary-400 font-medium ml-auto"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Grid */}
          {filteredTasks.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <Search size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">No matching days found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTasks.map((dayData) => (
                <div 
                  key={dayData.day} 
                  className={`glass-panel p-5 relative overflow-hidden transition-all duration-300 ${
                    dayData.isLocked ? 'opacity-60 cursor-not-allowed hover:opacity-80' : 
                    dayData.isCurrent ? 'ring-2 ring-primary-500 shadow-primary-500/20 shadow-xl cursor-pointer hover:-translate-y-1' : 
                    'cursor-pointer hover:-translate-y-1 hover:border-emerald-500/50'
                  }`}
                  onClick={() => {
                    if (!dayData.isLocked && dayData.isCurrent) navigate('/');
                  }}
                >
                  {dayData.isCurrent && <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl"></div>}
                  {dayData.isCompleted && <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>}

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className={`text-lg font-bold ${
                      dayData.isCompleted ? 'text-emerald-500 dark:text-emerald-400' : 
                      dayData.isCurrent ? 'text-primary-500 dark:text-primary-400' : 
                      'text-slate-400'
                    }`}>
                      <div className="flex flex-col">
                        <span>Day {dayData.day}</span>
                        <span className="text-xs font-normal opacity-80">{format(addDays(new Date(), dayData.day - currentDay), 'MMM d, yyyy')}</span>
                      </div>
                    </span>
                    
                    {dayData.isCompleted && <CheckCircle2 className="text-emerald-500" size={20} />}
                    {dayData.isCurrent && <Play className="text-primary-500 fill-primary-500" size={20} />}
                    {dayData.isLocked && <Lock className="text-slate-400 dark:text-slate-600" size={20} />}
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-slate-800 dark:text-white font-medium mb-1 truncate transition-colors duration-200">{dayData.topic}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">{dayData.tasks.length} {dayData.tasks.length === 1 ? 'task' : 'tasks'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Roadmap;
