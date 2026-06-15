import React, { useState, useCallback, useEffect } from 'react';
import { BookOpen, FileText, ChevronRight, PanelLeftClose, PanelLeft, Search, X, Loader2, Play, Pause, Edit3, Check } from 'lucide-react';
import { useTimer } from '../context/TimerContext';
const pdfNotes = [
  {
    id: 1,
    title: 'Algo for data analysis',
    category: 'Machine Learning',
    driveFileId: '1iVV_OJmNUk2kmpKcWXIX-jdYN3NrOtkA',
    },
  {
    id: 2,
    title: 'data manipulation and analysis',
    category: 'Machine Learning',
    driveFileId: '1N9YvFTDD11d1ttXMZjIZpXnHVoiNUHe_',
    },
  {
    id: 3,
    title: 'Data preprocessing concept',
    category: 'Machine Learning',
    driveFileId: '1L3ZDJzNg_z6SdxN0wn1VzoQS7wKk_WWX',
    },
  {
    id: 4,
    title: 'Deep learning',
    category: 'Machine Learning',
    driveFileId: '1ZEPLO0PmKB5PSCUxPqXrutlm2rRUmwIM',
    },
  {
    id: 5,
    title: 'Deep Learning Algorithms',
    category: 'Machine Learning',
    driveFileId: '1wZNzmqceGZhANrZwj5dQJDb0o8MRwxvn',
    },
  {
    id: 6,
    title: 'DSA Pattern',
    category: 'Data Structures',
    driveFileId: '1uvwDl0QyDDC5BOzUeKVgZDU1RTcc1wlQ',
    },
  {
    id: 7,
    title: 'Machine Learning Concepts',
    category: 'Machine Learning',
    driveFileId: '1_pWBiLZcaC9C4lV_W-g4rW6243as_nau',
    },
  {
    id: 8,
    title: 'ML Interview Questions',
    category: 'Machine Learning',
    driveFileId: '1U0LaJ5T_hDpCvLFyiFlbXsZ-WpLQu_Mn',
    },
  {
    id: 9,
    title: 'Sorting Algorithms',
    category: 'Data Structures',
    driveFileId: '14aY6U8ojtQXlo2EjyDKDirJbsIoYy3cU',
    },
  {
    id: 10,
    title: 'SQL',
    category: 'SQL',
    driveFileId: '1RsDuQEvQO3Z48FBmWHb5hDmFvMNKoPVx',
    },
  {
    id: 11,
    title: 'SQL Concepts',
    category: 'SQL',
    driveFileId: '1RQ2H_Tkd5N2WrP73xvBHL0ZOVaUQaPSs',
    },
  {
    id: 12,
    title: 'Tree interview patterns',
    category: 'Data Structures',
    driveFileId: '1Z9vxDqcloP1K3N7xCn4XfQbdkZ7osyzy',
    },
  {
    id: 13,
    title: '75 DSA Questions',
    category: 'Data Structures',
    driveFileId: '1xziQFnDIJSb7bDvhKuMyHQTm86mqXa4x',
    },
  {
    id: 14,
    title: 'DSA Pattern handbook',
    category: 'Data Structures',
    driveFileId: '1LMkFBBfFRuuvKiX-XPQLfI-0E5kSBDVJ',
    },
  {
    id: 15,
    title: 'IMP Ques Sol',
    category: 'Data Structures',
    driveFileId: '1CSQhpqFhzGsN1I0dwdJtsYuroJbUS72R',
    },
  {
    id: 16,
    title: 'Most asked question from dsa',
    category: 'Data Structures',
    driveFileId: '1UEof_IJL9LE2HuQJhXucm6KWQ_K1iZef',
    },
  {
    id: 17,
    title: 'RAG',
    category: 'Machine Learning',
    driveFileId: '1u0CteCpnghrVIX7GHIXla-eqiVF2n3jc',
    },
  {
    id: 18,
    title: 'RAG',
    category: 'Machine Learning',
    driveFileId: '1u0CteCpnghrVIX7GHIXla-eqiVF2n3jc',
    },
  {
    id: 19,
    title: 'Striver Sheet',
    category: 'Data Structures',
    driveFileId: '16pS7Ba17U7IBMtkK4xhageW1CNRVbAey',
    },
  {
    id: 20,
    title: 'Striver Sheet',
    category: 'Data Structures',
    driveFileId: '16pS7Ba17U7IBMtkK4xhageW1CNRVbAey',
  },
  {
    id: 21,
    title: 'Classification Metrics',
    category: 'Machine Learning',
    driveFileId: '1isYwPPUMMHCpdV9ais0z8UGqXJ_JyeAC',
  },
];
// Group notes by category
const groupedNotes = pdfNotes.reduce((acc, note) => {
  if (!acc[note.category]) acc[note.category] = [];
  acc[note.category].push(note);
  return acc;
}, {});

const categoryColors = {
  'Data Structures': { bg: 'bg-violet-500/10', text: 'text-violet-500 dark:text-violet-400', border: 'border-violet-500/20' },
  'Algorithms': { bg: 'bg-amber-500/10', text: 'text-amber-500 dark:text-amber-400', border: 'border-amber-500/20' },
  'System Design': { bg: 'bg-cyan-500/10', text: 'text-cyan-500 dark:text-cyan-400', border: 'border-cyan-500/20' },
  'Core CS': { bg: 'bg-rose-500/10', text: 'text-rose-500 dark:text-rose-400', border: 'border-rose-500/20' },
  'Machine Learning': { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500 dark:text-fuchsia-400', border: 'border-fuchsia-500/20' },
  'SQL': { bg: 'bg-sky-500/10', text: 'text-sky-500 dark:text-sky-400', border: 'border-sky-500/20' },
};

const InterviewPrep = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [iframeLoading, setIframeLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved'

  const { timeLeft, isActive, isFocus, toggleTimer, formatTime } = useTimer();

  const handleSelectNote = useCallback((note) => {
    setSelectedNote(note);
    setIframeLoading(true);
    setMobileSidebarOpen(false);
  }, []);

  // Load notes when selected note changes
  useEffect(() => {
    if (selectedNote) {
      const saved = localStorage.getItem(`interview_notes_${selectedNote.id}`);
      setNoteContent(saved || '');
    }
  }, [selectedNote]);

  // Debounced save
  useEffect(() => {
    if (!selectedNote) return;
    if (saveStatus !== 'saving' && noteContent === localStorage.getItem(`interview_notes_${selectedNote.id}`)) return; // Skip initial render save
    
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      localStorage.setItem(`interview_notes_${selectedNote.id}`, noteContent);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [noteContent, selectedNote]);

  const getPdfPreviewUrl = (fileId) => {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const filteredGroups = Object.entries(groupedNotes).reduce((acc, [category, notes]) => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) acc[category] = filtered;
    return acc;
  }, {});

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700/50">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 dark:bg-dark-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(filteredGroups).map(([category, notes]) => {
          const colors = categoryColors[category] || categoryColors['Core CS'];
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className={`text-[10px] uppercase tracking-widest font-bold ${colors.text}`}>
                  {category}
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50" />
              </div>
              <div className="space-y-1">
                {notes.map((note) => {
                  const isSelected = selectedNote?.id === note.id;
                  return (
                    <button
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                        isSelected
                          ? 'bg-primary-100 dark:bg-primary-500/10 border border-primary-500/30 shadow-sm shadow-primary-500/10'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <span className="text-lg shrink-0 group-hover:scale-110 transition-transform duration-200">
                        {note.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate transition-colors ${
                          isSelected
                            ? 'text-primary-700 dark:text-primary-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {note.title}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`shrink-0 transition-all duration-200 ${
                          isSelected
                            ? 'text-primary-500 opacity-100 translate-x-0'
                            : 'text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {Object.keys(filteredGroups).length === 0 && (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500">
            <Search size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No notes match your search.</p>
          </div>
        )}
      </div>

      {/* Footer count */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700/50">
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          {pdfNotes.length} study notes available
        </p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-violet-100 dark:bg-violet-500/20 p-2 rounded-xl text-violet-600 dark:text-violet-400">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors duration-200">
              Interview Prep
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-200">
              Study notes for placement preparation
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mini Timer Widget */}
          <div className="flex items-center gap-2 bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm mr-2 transition-colors">
            <span className={`w-2.5 h-2.5 rounded-full ${isFocus ? 'bg-primary-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-emerald-500'}`}></span>
            <span className="font-mono text-sm font-bold tracking-tight text-slate-700 dark:text-slate-200 w-12 text-center">
              {formatTime(timeLeft)}
            </span>
            <button 
              onClick={toggleTimer}
              className="ml-1 flex items-center justify-center w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {isActive ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
          </div>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-slate-600 dark:text-slate-300 rounded-lg transition-all"
          >
            <FileText size={16} />
            Notes
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-slate-600 dark:text-slate-300 rounded-lg transition-all"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex gap-4 min-h-0 relative">
        {/* Desktop sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-white dark:bg-dark-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 ${
            sidebarOpen ? 'w-72 min-w-[288px]' : 'w-0 min-w-0 border-0 opacity-0'
          }`}
        >
          {sidebarOpen && <SidebarContent />}
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
              style={{ animation: 'fadeIn 0.2s ease-out' }}
            />
            <aside
              className="absolute top-0 left-0 w-80 max-w-[85vw] h-full bg-white dark:bg-dark-800 shadow-2xl border-r border-slate-200 dark:border-slate-700 flex flex-col"
              style={{ animation: 'slideInLeft 0.3s ease-out' }}
            >
              <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700/50">
                <span className="text-sm font-semibold text-slate-800 dark:text-white">Study Notes</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* PDF Viewer */}
        <main className="flex-1 bg-white dark:bg-dark-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col min-w-0 transition-colors duration-200">
          {selectedNote ? (
            <>
              {/* Viewer header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-dark-900/30">
                <span className="text-lg">{selectedNote.icon}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-white truncate transition-colors">
                    {selectedNote.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                    {selectedNote.category}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      showNotes 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30' 
                        : 'bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-700 shadow-sm'
                    }`}
                  >
                    <Edit3 size={14} />
                    {showNotes ? 'Hide Notes' : 'Show Notes'}
                  </button>
                  <div className="hidden sm:block w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
                  {selectedNote.driveFileId && !selectedNote.driveFileId.startsWith('PLACEHOLDER') && (
                    <a
                      href={`https://drive.google.com/file/d/${selectedNote.driveFileId}/view`}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden sm:flex text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium items-center gap-1 transition-colors"
                    >
                      Open in Drive
                      <ChevronRight size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Split Pane Container */}
              <div className="flex-1 flex overflow-hidden relative flex-col md:flex-row">
                
              {/* PDF iframe */}
              <div className={`relative bg-slate-100 dark:bg-dark-900 transition-all duration-300 h-full ${showNotes ? 'md:w-[60%] border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700' : 'w-full'}`}>
                {iframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100/80 dark:bg-dark-900/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="text-primary-500 animate-spin" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">Loading PDF...</p>
                    </div>
                  </div>
                )}
                {selectedNote.driveFileId.startsWith('PLACEHOLDER') ? (
                  <div className="flex items-center justify-center h-full p-8">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 mx-auto mb-4 bg-slate-200 dark:bg-dark-800 rounded-2xl flex items-center justify-center">
                        <FileText size={36} className="text-slate-400 dark:text-slate-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Placeholder PDF
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Replace <code className="text-xs bg-slate-200 dark:bg-dark-800 px-1.5 py-0.5 rounded font-mono">{selectedNote.driveFileId}</code> in{' '}
                        <code className="text-xs bg-slate-200 dark:bg-dark-800 px-1.5 py-0.5 rounded font-mono">InterviewPrep.jsx</code>{' '}
                        with the actual Google Drive file ID.
                      </p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    key={selectedNote.id}
                    src={getPdfPreviewUrl(selectedNote.driveFileId)}
                    className="w-full h-full border-0"
                    allow="autoplay"
                    title={selectedNote.title}
                    onLoad={() => setIframeLoading(false)}
                  />
                )}
              </div>

              {/* Notes Panel */}
              {showNotes && (
                <div className="w-full md:w-[40%] h-64 md:h-full bg-white dark:bg-dark-800 flex flex-col transition-all duration-300 relative z-10">
                  <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/80 dark:bg-dark-900/80 backdrop-blur-sm">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <Edit3 size={12} className="text-primary-500" />
                      My Notes
                    </span>
                    <div className="flex items-center gap-2 text-xs font-medium">
                      {saveStatus === 'saving' && <span className="text-slate-400 flex items-center gap-1.5"><Loader2 size={12} className="animate-spin text-primary-500" /> Saving...</span>}
                      {saveStatus === 'saved' && <span className="text-emerald-500 flex items-center gap-1.5"><Check size={12} /> Saved</span>}
                    </div>
                  </div>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Type your notes here...&#10;&#10;These notes are saved automatically to your browser and linked to this specific topic. Use them to jot down important points, doubts, or code snippets."
                    className="flex-1 w-full p-5 resize-none focus:outline-none bg-transparent text-slate-700 dark:text-slate-300 placeholder-slate-400/60 dark:placeholder-slate-500/60 text-sm leading-relaxed font-medium custom-scrollbar"
                    style={{ lineHeight: '1.7' }}
                  />
                </div>
              )}



              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-violet-500/20 rounded-3xl rotate-6 animate-pulse" />
                  <div className="absolute inset-0 bg-violet-500/10 rounded-3xl -rotate-3" />
                  <div className="relative w-full h-full bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg">
                    <BookOpen size={36} className="text-violet-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 transition-colors">
                  Select a Study Note
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors">
                  Choose a topic from the sidebar to preview your study material. All notes are rendered directly from Google Drive.
                </p>
                <button
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setMobileSidebarOpen(true);
                    }
                  }}
                  className="md:hidden mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-violet-100 hover:bg-violet-200 dark:bg-violet-500/10 dark:hover:bg-violet-500/20 text-violet-700 dark:text-violet-400 rounded-lg transition-all"
                >
                  <FileText size={16} />
                  Browse Notes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default InterviewPrep;
