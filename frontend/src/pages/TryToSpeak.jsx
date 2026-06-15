import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RefreshCw, Volume2, CheckCircle2, AlertCircle, FileText, Key, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const targetParagraphs = [
  "In software engineering, a design pattern is a general repeatable solution to a commonly occurring problem in software design. A design pattern isn't a finished design that can be transformed directly into code. It is a description or template for how to solve a problem that can be used in many different situations.",
  "Good morning sir. My name is Chandan Raj, and I am currently pursuing B.Tech in Computer Science with specialization in AI and ML from Graphic Era Deemed to be University, Dehradun. I have strong interest in Machine Learning, NLP, Computer Vision, and Generative AI. I have worked on projects like a BERT-based Sentiment Analyzer, a Multi-Agent Prototype Builder using local LLMs, and a QR-Barcode Authentication System. I also completed a Computer Vision internship where I worked with YOLOv8, OpenCV, and DeepFace. I enjoy building practical AI-powered applications and continuously learning new technologies.",
  "Machine Learning is a subset of Artificial Intelligence that enables computers to learn patterns from data and make predictions or decisions without being explicitly programmed for every task. Instead of writing fixed rules, we train a model using historical data, and the model learns relationships within that data. There are three main types: Supervised Learning, Unsupervised Learning, and Reinforcement Learning. Machine Learning is widely used in applications such as recommendation systems, fraud detection, sentiment analysis, image recognition, and predictive analytics. Its main goal is to improve performance automatically through experience and data.",
  "Data structures are a way of organizing and storing data so that they can be accessed and worked with efficiently. They define the relationship between the data, and the operations that can be performed on the data."
];

const TryToSpeak = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [targetText, setTargetText] = useState(targetParagraphs[0]);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [topic, setTopic] = useState('');
  
  const recognitionRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Your browser does not support the Web Speech API. Please try Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setError('');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone permissions in your browser.');
        } else if (event.error !== 'no-speech') {
          setError(`Microphone error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Could not start microphone. Please try again.');
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setTranscript('');
      startRecording();
    }
  };

  const nextParagraph = () => {
    const nextIndex = (paragraphIndex + 1) % targetParagraphs.length;
    setParagraphIndex(nextIndex);
    setTargetText(targetParagraphs[nextIndex]);
    setTopic('');
    setTranscript('');
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey);
    setShowApiKeyInput(false);
  };

  const handleAiGenerateClick = () => {
    if (!apiKey) {
      setError('Please provide a Gemini API key first to generate questions.');
      setShowApiKeyInput(true);
      return;
    }
    setShowTopicInput(!showTopicInput);
  };

  const generateQuestion = async () => {
    if (!apiKey) {
      setError('Please provide a Gemini API key first to generate questions.');
      setShowApiKeyInput(true);
      return;
    }
    if (!topic.trim()) {
      setError('Please enter a topic first.');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", generationConfig: { temperature: 0.9 } });
      const prompt = `You are an expert technical interviewer. Generate a technical interview question for a software engineering candidate about the topic: "${topic}". Ensure it is a completely new and diverse question. Along with the question, provide a well-structured, clear, and concise answer. Format the response strictly as:\nQuestion: [The Question]\n\nAnswer: [The Answer]\nKeep the answer conversational and suitable for a candidate to practice speaking aloud. Do not use markdown bolding or formatting, just plain text.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setTargetText(text);
      setShowTopicInput(false);
      setTranscript('');
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    } catch (err) {
      console.error('Failed to generate question:', err);
      let errorMsg = err.message || 'Failed to generate question. Please check your API key.';
      
      // Simplify common API errors
      if (errorMsg.includes('suspended')) {
        errorMsg = "Your Gemini API key has been suspended. Please generate a new key from Google AI Studio.";
      } else if (errorMsg.includes('API key not valid') || errorMsg.includes('invalid')) {
        errorMsg = "Your Gemini API key is invalid. Please check that you entered it correctly.";
      } else if (errorMsg.includes('quota')) {
        errorMsg = "Your Gemini API key has exceeded its quota. Please try again later or check your billing details.";
      }
      
      setError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors duration-200 flex items-center gap-3">
            <div className="bg-rose-100 dark:bg-rose-500/20 p-2 rounded-xl text-rose-600 dark:text-rose-400">
              <Volume2 size={24} />
            </div>
            Speech Practice
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-200">
            Practice your communication skills by reading technical concepts out loud.
          </p>
        </div>
        <button 
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium text-sm"
        >
          <Key size={16} />
          {apiKey ? 'Update API Key' : 'Add API Key'}
        </button>
      </header>

      {showApiKeyInput && (
        <form onSubmit={handleSaveApiKey} className="bg-white dark:bg-dark-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-3 items-start md:items-center animate-fade-in shadow-sm">
          <Key size={20} className="text-slate-400 hidden md:block" />
          <div className="flex-1 w-full relative">
            <input 
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google Gemini API Key (AIzaSy...)" 
              className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 pr-10 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" className="w-full md:w-auto px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
            Save Key
          </button>
        </form>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Target Paragraph */}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex-1 flex flex-col transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-primary-500" />
                Target Text {topic && !showTopicInput && <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-dark-800 px-2 py-0.5 rounded-full ml-1 truncate max-w-[120px]" title={topic}>{topic}</span>}
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAiGenerateClick}
                  disabled={isGenerating}
                  className={`text-xs font-medium px-3 py-1.5 ${showTopicInput ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20'} rounded-md flex items-center gap-1.5 transition-colors disabled:opacity-50`}
                >
                  {isGenerating && !topic ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  New Topic
                </button>
                {topic && !showTopicInput && (
                  <button 
                    onClick={generateQuestion}
                    disabled={isGenerating}
                    className="text-xs font-medium px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    Next Q
                  </button>
                )}
                <button 
                  onClick={nextParagraph}
                  className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors px-2 py-1.5"
                >
                  <RefreshCw size={14} />
                  Default
                </button>
              </div>
            </div>
            
            {showTopicInput && (
              <div className="mb-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 animate-fade-in bg-indigo-50/50 dark:bg-indigo-500/5 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/10 shadow-sm">
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter topic (e.g. React hooks, SQL joins)..."
                    className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
                    onKeyDown={(e) => e.key === 'Enter' && topic.trim() && generateQuestion()}
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowTopicInput(false)}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={generateQuestion}
                    disabled={isGenerating || !topic.trim()}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating && <Loader2 size={16} className="animate-spin" />}
                    Generate
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-dark-900 rounded-xl p-4 md:p-6 border border-slate-100 dark:border-slate-800 flex-1 flex">
              <textarea
                value={targetText}
                onChange={(e) => setTargetText(e.target.value)}
                placeholder="Paste your own text here or click 'Change Topic' to load a new paragraph..."
                className="w-full h-full min-h-[250px] bg-transparent resize-none outline-none text-slate-700 dark:text-slate-300 text-lg md:text-xl leading-relaxed font-medium custom-scrollbar"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Transcription Output */}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex-1 flex flex-col transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                Your Speech
              </h2>
              {transcript && (
                <button 
                  onClick={resetTranscript}
                  className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={14} />
                  Clear
                </button>
              )}
            </div>
            
            <div className="bg-slate-50 dark:bg-dark-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 flex-1 min-h-[250px] relative">
              {!transcript && !isRecording && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-6 text-center">
                  <Mic size={32} className="mb-3 opacity-50" />
                  <p className="text-sm">Click the microphone button below and start reading the target text.</p>
                </div>
              )}
              {transcript && (
                <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
                  {transcript}
                </p>
              )}
              {isRecording && (
                <div className="flex items-center gap-2 mt-4 text-sm text-primary-500 font-medium">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  Listening...
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={toggleRecording}
                disabled={!!error && !isRecording}
                className={`relative flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording 
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' 
                    : 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/30'
                }`}
              >
                {isRecording && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-rose-400 opacity-40"></span>
                )}
                {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryToSpeak;
