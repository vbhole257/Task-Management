'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Box, Factory, Briefcase, Rocket, Sparkles, ChevronDown } from 'lucide-react';
import { WorkspaceConfig, WorkspaceId } from '@/types';

interface QuickCaptureBarProps {
  workspaces: WorkspaceConfig[];
  activeWorkspace: WorkspaceId | 'all';
  onQuickCapture: (text: string, workspaceId?: string) => Promise<void>;
}

export const QuickCaptureBar: React.FC<QuickCaptureBarProps> = ({
  workspaces,
  activeWorkspace,
  onQuickCapture,
}) => {
  const [inputText, setInputText] = useState('');
  const [targetWs, setTargetWs] = useState<string>('rambagh');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Automatically sync target workspace with currently viewed workspace tab (if not 'all')
  useEffect(() => {
    if (activeWorkspace !== 'all') {
      setTargetWs(activeWorkspace);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  const toggleSpeech = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. You can type or use the iPhone Siri shortcut.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech error:', event);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onQuickCapture(inputText.trim(), targetWs);
    setInputText('');
    setIsSubmitting(false);
  };

  const currentWsConfig = workspaces.find((w) => w.id === targetWs);

  const getWsIcon = (id: string) => {
    switch (id) {
      case 'rambagh':
        return <Box className="h-3.5 w-3.5 text-purple-400" />;
      case 'factory':
        return <Factory className="h-3.5 w-3.5 text-emerald-400" />;
      case 'it-job':
        return <Briefcase className="h-3.5 w-3.5 text-sky-400" />;
      case 'it-self':
        return <Rocket className="h-3.5 w-3.5 text-rose-400" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-2 sm:p-4 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 border border-slate-700/80 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition shadow-inner"
        >
          {/* Simple Direct Category Selector Dropdown */}
          <div className="relative shrink-0">
            <select
              value={targetWs}
              onChange={(e) => setTargetWs(e.target.value)}
              className="appearance-none bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl pl-8 pr-6 py-2.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer transition"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.shortName}
                </option>
              ))}
            </select>
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              {getWsIcon(targetWs)}
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>

          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={toggleSpeech}
            className={`p-2.5 rounded-xl transition shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
            }`}
            title={isListening ? 'Listening...' : 'Tap to Speak (Voice)'}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to voice...'
                : `Add task to ${currentWsConfig?.shortName || 'workspace'}...`
            }
            className="flex-1 min-w-0 bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />

          {/* Send / Add Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs disabled:opacity-40 disabled:pointer-events-none hover:from-indigo-500 hover:to-purple-500 transition shadow-md shadow-indigo-600/30 active:scale-95 flex items-center gap-1 shrink-0"
            title="Add Task"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>
      </div>
    </div>
  );
};
