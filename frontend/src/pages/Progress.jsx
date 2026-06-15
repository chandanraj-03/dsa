import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Target, Trophy, Brain, Flame, TrendingUp } from 'lucide-react';

// ─── Activity Heatmap Component ────────────────────────────────────
const ActivityHeatmap = ({ activity }) => {
  const today = new Date();
  const weeks = 18; // ~4.5 months of history
  const totalDays = weeks * 7;

  // Build the grid of dates
  const cells = useMemo(() => {
    // Force today to midnight in local time
    const localToday = new Date();
    localToday.setHours(0, 0, 0, 0);

    const result = [];
    // Start from (totalDays - 1) days ago
    const startDate = new Date(localToday);
    startDate.setDate(startDate.getDate() - totalDays + 1);
    
    // Align to start of the week (Sunday)
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    for (let w = 0; w < weeks + 1; w++) {
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(cellDate.getDate() + (w * 7) + d);
        
        // Format date string as YYYY-MM-DD in local time
        const yyyy = cellDate.getFullYear();
        const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
        const dd = String(cellDate.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        
        const count = activity[dateStr] || 0;
        const isFuture = cellDate > localToday;
        result.push({ date: cellDate, dateStr, count, isFuture });
      }
    }
    return result;
  }, [activity, totalDays, weeks]);

  const getColorClass = (count, isFuture) => {
    if (isFuture) return 'bg-transparent';
    if (count === 0) return 'bg-slate-200 dark:bg-slate-800';
    if (count === 1) return 'bg-emerald-300 dark:bg-emerald-800';
    if (count <= 3) return 'bg-emerald-400 dark:bg-emerald-600';
    if (count <= 5) return 'bg-emerald-500 dark:bg-emerald-500';
    return 'bg-emerald-600 dark:bg-emerald-400';
  };

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  // Group cells into weeks (columns)
  const weekColumns = [];
  for (let i = 0; i < cells.length; i += 7) {
    weekColumns.push(cells.slice(i, i + 7));
  }

  return (
    <div className="glass-panel p-6">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2 transition-colors">
        <Flame size={20} className="text-emerald-500" />
        Activity Heatmap
      </h2>
      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-fit">
          {/* Day labels column */}
          <div className="flex flex-col gap-0.5 mr-1 shrink-0">
            {dayLabels.map((label, i) => (
              <div key={i} className="w-6 h-[14px] flex items-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{label}</span>
              </div>
            ))}
          </div>
          {/* Heatmap grid */}
          {weekColumns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((cell, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`w-[14px] h-[14px] rounded-sm transition-colors ${getColorClass(cell.count, cell.isFuture)} ${cell.isFuture ? '' : 'hover:ring-1 hover:ring-primary-400'}`}
                  title={cell.isFuture ? '' : `${cell.dateStr}: ${cell.count} task${cell.count !== 1 ? 's' : ''} completed`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">Less</span>
        <div className="w-[14px] h-[14px] rounded-sm bg-slate-200 dark:bg-slate-800" />
        <div className="w-[14px] h-[14px] rounded-sm bg-emerald-300 dark:bg-emerald-800" />
        <div className="w-[14px] h-[14px] rounded-sm bg-emerald-400 dark:bg-emerald-600" />
        <div className="w-[14px] h-[14px] rounded-sm bg-emerald-500 dark:bg-emerald-500" />
        <div className="w-[14px] h-[14px] rounded-sm bg-emerald-600 dark:bg-emerald-400" />
        <span className="text-[10px] text-slate-400 dark:text-slate-500">More</span>
      </div>
    </div>
  );
};

// ─── Topic Progress Bar Component ──────────────────────────────────
const TopicProgressBar = ({ topic, total, completed, percentage }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate mr-2 transition-colors">{topic}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{completed}/{total}</span>
    </div>
    <div className="w-full bg-slate-200 dark:bg-dark-900 rounded-full h-2 transition-colors">
      <div
        className="h-2 rounded-full transition-all duration-700 bg-gradient-to-r from-primary-500 to-emerald-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

// ─── Main Progress Page ────────────────────────────────────────────
const Progress = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState({});
  const [topics, setTopics] = useState([]);
  const [mastery, setMastery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, activityRes, topicsRes, masteryRes] = await Promise.all([
          api.get('/progress/stats'),
          api.get('/progress/activity'),
          api.get('/progress/by-topic'),
          api.get('/progress/mastery-stats')
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data.activity || {});
        setTopics(topicsRes.data.topics || []);
        setMastery(masteryRes.data.mastery || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const chartData = [
    { name: 'Completed', value: stats?.completed_tasks || 0 },
    { name: 'Remaining', value: (stats?.total_tasks || 0) - (stats?.completed_tasks || 0) }
  ];
  
  const COLORS = ['#10b981', '#1e293b'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 transition-colors">My Progress</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6 transition-colors">Track your completion metrics and analytics.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 bg-primary-500/20 rounded-2xl shrink-0">
            <Target className="text-primary-400" size={28} />
          </div>
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm transition-colors">Total Tasks</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">{stats?.total_tasks}</div>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 rounded-2xl shrink-0">
            <Trophy className="text-emerald-400" size={28} />
          </div>
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm transition-colors">Completed</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">{stats?.completed_tasks}</div>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 bg-amber-500/20 rounded-2xl shrink-0">
            <Brain className="text-amber-400" size={28} />
          </div>
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm transition-colors">Remaining</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">{(stats?.total_tasks || 0) - (stats?.completed_tasks || 0)}</div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap activity={activity} />

      {/* Chart + Topic Breakdown + Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 transition-colors">Completion Overview</h2>
          <div className="w-full h-64 relative">
            {stats?.total_tasks > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: '500', marginBottom: '4px' }}
                  />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">{stats?.percentage}%</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Done</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-slate-400">0%</span>
                </div>
                <p className="text-slate-500 text-sm">No tasks available</p>
              </div>
            )}
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2 transition-colors">
            <TrendingUp size={20} className="text-primary-400" />
            Progress by Topic
          </h2>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {topics.length === 0 ? (
              <p className="text-sm text-slate-400">No topic data yet. Complete some tasks to see your breakdown.</p>
            ) : (
              topics.map((t, i) => (
                <TopicProgressBar
                  key={i}
                  topic={t.topic}
                  total={t.total}
                  completed={t.completed}
                  percentage={t.percentage}
                />
              ))
            )}
          </div>
        </div>

        {/* Topic Mastery Radar */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors">
            <Brain size={20} className="text-violet-500" />
            Subject Mastery
          </h2>
          <div className="w-full h-64 relative">
            {mastery && mastery.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mastery}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Mastery" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: '500', marginBottom: '4px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Brain size={48} className="text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-slate-500 text-sm">Not enough data for mastery</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
