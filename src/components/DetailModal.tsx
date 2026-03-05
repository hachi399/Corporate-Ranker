import React, { useState } from 'react';
import { X, ExternalLink, MessageSquare, Loader2, Layout, ShieldCheck, Star } from 'lucide-react';
import { CompanyScore, EVALUATION_ITEMS } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { fetchExplanation } from '../services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  company: CompanyScore | null;
  onClose: () => void;
}

const DetailModal: React.FC<Props> = ({ company, onClose }) => {
  const [explanations, setExplanations] = useState<Record<string, { text: string; loading: boolean }>>({});
  const [tab, setTab] = useState<'front' | 'back'>('front');

  const handleDoubleClick = async (itemId: string, label: string, score: number, rawValue: any) => {
    if (explanations[itemId]) return;

    setExplanations(prev => ({ ...prev, [itemId]: { text: '', loading: true } }));
    try {
      const text = await fetchExplanation(company.name, label, score, rawValue);
      setExplanations(prev => ({ ...prev, [itemId]: { text, loading: false } }));
    } catch (err) {
      setExplanations(prev => ({ ...prev, [itemId]: { text: '説明の取得に失敗しました。', loading: false } }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
          {/* Header - More Compact */}
          <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{company.name}</h2>
              <p className="text-zinc-400 font-bold mt-1 uppercase tracking-[0.2em] text-[10px]">{company.raw.englishName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-200 rounded-full transition-all active:scale-90"
            >
              <X size={24} className="text-zinc-500" />
            </button>
          </div>

          {/* Tabs - More Compact */}
          <div className="flex border-b border-zinc-100 bg-white sticky top-0 z-10">
            <button
              onClick={() => setTab('front')}
              className={cn(
                "flex-1 py-4 text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest",
                tab === 'front' ? "text-zinc-900 border-b-2 border-zinc-900 bg-zinc-50/50" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Layout size={16} />
              表側（公開情報）
            </button>
            <button
              onClick={() => setTab('back')}
              className={cn(
                "flex-1 py-4 text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest",
                tab === 'back' ? "text-zinc-900 border-b-2 border-zinc-900 bg-zinc-50/50" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <ShieldCheck size={16} />
              裏側（実態情報）
            </button>
          </div>

          {/* Content - Larger Items */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10">
            <div className="grid gap-4">
              {EVALUATION_ITEMS[tab].map((item) => {
                const score = company.scores[item.id];
                const rawValue = company.raw[item.id as keyof typeof company.raw];
                const sourceUrl = (company.raw.sources as any)?.[item.id];
                const explanation = explanations[item.id];

                return (
                  <div 
                    key={item.id} 
                    onDoubleClick={() => handleDoubleClick(item.id, item.label, score, rawValue)}
                    className="group relative bg-zinc-50/30 hover:bg-white p-6 sm:p-8 rounded-[1.5rem] border border-zinc-100 hover:border-zinc-300 transition-all cursor-pointer select-none shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-zinc-900 tracking-tight">{item.label}</span>
                            {sourceUrl && (
                              <a 
                                href={sourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors bg-white rounded-lg border border-zinc-100 shadow-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={28}
                                className={cn(
                                  "transition-all",
                                  s <= score ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                                )}
                              />
                            ))}
                            <span className="ml-4 text-4xl font-black text-zinc-900">{score}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="shrink-0">
                            <div className="text-[10px] text-zinc-400 font-black mb-1 uppercase tracking-widest">
                              実数値
                            </div>
                            <div className="text-xl font-mono font-bold text-zinc-900 bg-white px-5 py-2.5 rounded-xl border border-zinc-100 shadow-inner inline-block">
                              {String(rawValue)}
                            </div>
                          </div>
                          
                          {/* AI Explanation Area (Desktop Inline) */}
                          <AnimatePresence>
                            {(explanation || explanation?.loading) && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 bg-zinc-900 text-white p-5 rounded-2xl text-sm leading-relaxed shadow-xl border border-white/10"
                              >
                                <div className="flex items-center gap-2 mb-2 text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                  <MessageSquare size={14} />
                                  AI Analysis
                                </div>
                                {explanation?.loading ? (
                                  <div className="flex items-center gap-3 text-zinc-500 font-bold italic">
                                    <Loader2 size={16} className="animate-spin" />
                                    分析中...
                                  </div>
                                ) : (
                                  <div className="font-medium text-zinc-100">{explanation?.text}</div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    
                    {!explanation && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-zinc-300 uppercase tracking-widest hidden sm:block">
                        Double click for AI explanation
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer - More Compact */}
          <div className="px-8 py-6 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-900/20">
                <MessageSquare size={20} />
              </div>
              <div className="text-[10px] font-bold text-zinc-400 max-w-[200px] leading-tight uppercase tracking-wider">
                項目をダブルクリックするとAIが評価理由を解説します
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-black hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-95 uppercase tracking-widest text-xs"
            >
              閉じる
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

export default DetailModal;
