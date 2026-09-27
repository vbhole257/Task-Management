'use client';

import React, { useState } from 'react';
import { Smartphone, Copy, Check, X, Mic, ExternalLink, ShieldCheck, Zap, Layers } from 'lucide-react';

interface SiriGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SiriGuideModal: React.FC<SiriGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://192.168.1.36:3000';
  const captureEndpoint = `${currentOrigin}/api/capture`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Smartphone className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Simple iPhone Voice & Quick Capture Setup
              </h2>
              <p className="text-xs text-slate-400">Pick Category $\rightarrow$ Speak $\rightarrow$ Added Instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-300">
          {/* Method A: In-App Direct Voice (Easiest) */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Mic className="h-4 w-4" />
              </span>
              <span>Method 1: In-App 1-Tap Voice (Super Easy)</span>
            </div>
            <p className="text-slate-300 text-xs pl-7">
              1. Open the app on your phone.
              <br />
              2. Choose your category at the bottom dropdown (e.g. <strong>Factory Ops</strong> or <strong>3D & Scanning</strong>).
              <br />
              3. Tap the <strong>Microphone icon 🎙️</strong> and speak your task.
              <br />
              4. It automatically saves directly into that category!
            </p>
          </div>

          {/* Method B: Siri Shortcut with Category Menu */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="p-1.5 rounded-lg bg-purple-600 text-white">
                <Smartphone className="h-4 w-4" />
              </span>
              <span>Method 2: &quot;Hey Siri, Add Task&quot; Shortcut</span>
            </div>

            <p className="text-slate-400 text-xs pl-7">
              In your iPhone <strong>Shortcuts app</strong>, create a shortcut named <strong>&quot;Add Task&quot;</strong>:
            </p>

            <div className="pl-7 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-purple-300 block mb-0.5">Step 1: Choose from Menu</span>
                <p className="text-slate-400">Options: <strong>Rambagh Office</strong>, <strong>Factory</strong>, <strong>IT Job</strong>, <strong>IT Self</strong></p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-indigo-300 block mb-0.5">Step 2: Dictate Text</span>
                <p className="text-slate-400">Dictate what you want to add.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="font-bold text-emerald-300 block">Step 3: Get Contents of URL (POST)</span>
                <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="font-mono text-[11px] truncate text-emerald-300">{captureEndpoint}</span>
                  <button
                    onClick={() => copyToClipboard(captureEndpoint)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 shrink-0"
                  >
                    {copiedUrl ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Request Body: JSON $\rightarrow$ Key: <code className="text-purple-300">text</code>, Value: <code className="text-indigo-300">Dictated Text</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
