import React, { useState, useEffect } from 'react';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, FileText, Check } from 'lucide-react';

const NotesModal = ({ isOpen, onClose, taskId, taskTitle }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'

  useEffect(() => {
    if (isOpen && taskId) {
      fetchNotes();
      setActiveTab('write');
    }
  }, [isOpen, taskId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/progress/notes/${taskId}`);
      setNotes(res.data.notes || '');
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/progress/notes/${taskId}`, { notes });
      onClose();
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setSaving(false);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <FileText className="text-primary-500" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Notes</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{taskTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-dark-900/50">
          <button 
            onClick={() => setActiveTab('write')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'write' ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Write
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Preview
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[300px] bg-slate-50 dark:bg-dark-900">
          {loading ? (
             <div className="flex justify-center items-center h-full min-h-[300px]">
               <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : activeTab === 'write' ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes, algorithm explanations, or code snippets here (Markdown supported)..."
                className="w-full h-full min-h-[300px] p-4 bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-slate-800 dark:text-slate-200 font-mono text-sm"
              />
          ) : activeTab === 'preview' ? (
              <div className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-dark-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[300px]">
                {notes ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
                ) : (
                  <p className="text-slate-400 italic">Nothing to preview yet.</p>
                )}
              </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-800">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Check size={16} />
            )}
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
