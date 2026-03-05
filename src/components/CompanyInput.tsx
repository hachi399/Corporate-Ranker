import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onEvaluate: (names: string[]) => void;
  isLoading: boolean;
}

export default function CompanyInput({ onEvaluate, isLoading }: Props) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = inputText
      .split(/[\n,、]+/)
      .map(n => n.trim())
      .filter(n => n !== '');
    
    if (names.length === 0) return;
    onEvaluate(names.slice(0, 100)); // Limit to 100
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-black/5">
      <h2 className="text-2xl font-semibold mb-6 tracking-tight text-zinc-900">評価する企業を入力</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="企業名を改行またはカンマ区切りで入力してください（最大100社）&#10;例: トヨタ, ソニー, 任天堂"
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all resize-none"
            required
          />
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <button
            type="submit"
            disabled={isLoading || inputText.trim() === ''}
            className="flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-900/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={20} />
            )}
            <span>AIで評価を開始する</span>
          </button>
        </div>
      </form>
    </div>
  );
}
