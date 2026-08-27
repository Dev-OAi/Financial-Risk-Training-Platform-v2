import React, { useState } from 'react';
import { Send, Sparkles, RefreshCw } from 'lucide-react';
import { ThemeMode } from '../types';

interface SearchBoxProps {
  onSearch: (promptText: string, isFraudulent?: boolean) => void;
  isGenerating: boolean;
  themeMode: ThemeMode;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isGenerating, themeMode }) => {
  const [promptText, setPromptText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    const isFraud = promptText.toLowerCase().includes('fraud') || promptText.toLowerCase().includes('bad') || promptText.toLowerCase().includes('altered');
    onSearch(promptText, isFraud);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm md:max-w-md relative flex items-center">
      <div className="absolute left-3 text-[#bdc1c6] font-semibold flex items-center gap-1.5 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[11px] font-mono hidden md:inline">AI:</span>
      </div>
      <input
        type="text"
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        placeholder="Search documents or prompt AI..."
        className={`w-full pl-8 md:pl-12 pr-10 py-1.5 rounded-lg border text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-[#5f6368] transition-all ${
          themeMode === 'dark'
            ? 'bg-[#323639] border-[#3c4043] text-[#e8eaed] placeholder-[#bdc1c6]'
            : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124] font-medium placeholder-[#5f6368]'
        }`}
      />
      <button
        type="submit"
        disabled={isGenerating || !promptText.trim()}
        className="absolute right-1.5 p-1 rounded-md bg-[#3c4043] hover:bg-[#5f6368] text-[#e8eaed] shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title="Generate Training Template"
      >
        {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
      </button>
    </form>
  );
};
