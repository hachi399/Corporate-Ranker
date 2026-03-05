import React, { useState } from 'react';
import { Building2, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import CompanyInput from './components/CompanyInput';
import RankingTable from './components/RankingTable';
import DetailModal from './components/DetailModal';
import InfoModal from './components/InfoModal';
import { fetchCompanyData } from './services/gemini';
import { calculateScores } from './utils/scoring';
import { generatePDF } from './utils/pdf';
import { CompanyScore, ApiUsage } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CompanyScore[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyScore | null>(null);
  const [usage, setUsage] = useState<ApiUsage | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, estimatedSeconds: 0 });
  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; type: 'evaluation' | 'usage'; title: string }>({
    isOpen: false,
    type: 'evaluation',
    title: ''
  });

  const handleEvaluate = async (names: string[]) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setUsage(null);
    
    const batchSize = 10;
    const totalBatches = Math.ceil(names.length / batchSize);
    const allData: any[] = [];
    let totalUsage: ApiUsage = { promptTokens: 0, candidatesTokens: 0, totalTokens: 0, estimatedCostUsd: 0 };

    setProgress({ current: 0, total: names.length, estimatedSeconds: names.length * 1.5 });

    try {
      for (let i = 0; i < names.length; i += batchSize) {
        const batch = names.slice(i, i + batchSize);
        const { data: rawData, usage: apiUsage } = await fetchCompanyData(batch);
        
        allData.push(...rawData);
        totalUsage = {
          promptTokens: totalUsage.promptTokens + apiUsage.promptTokens,
          candidatesTokens: totalUsage.candidatesTokens + apiUsage.candidatesTokens,
          totalTokens: totalUsage.totalTokens + apiUsage.totalTokens,
          estimatedCostUsd: totalUsage.estimatedCostUsd + apiUsage.estimatedCostUsd
        };

        setProgress(prev => ({ 
          ...prev, 
          current: Math.min(i + batchSize, names.length),
          estimatedSeconds: Math.max(0, (names.length - (i + batchSize)) * 1.5)
        }));
      }

      setUsage(totalUsage);
      
      if (allData.length === 0) {
        throw new Error('データの取得に失敗しました。企業名を確認してください。');
      }

      const scoredData = allData.map(raw => {
        const { scores, total } = calculateScores(raw);
        return {
          name: raw.name,
          scores,
          total,
          raw
        };
      });

      const sortedData = [...scoredData].sort((a, b) => b.total - a.total);
      setResults(sortedData);
    } catch (err: any) {
      setError(err.message || '予期せぬエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (results.length > 0) {
      generatePDF(results);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Building2 className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Corporate Ranker</h1>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-zinc-500">
            <button 
              onClick={() => setInfoModal({ isOpen: true, type: 'evaluation', title: '評価項目について' })}
              className="hover:text-zinc-900 cursor-pointer transition-colors"
            >
              評価項目について
            </button>
            <button 
              onClick={() => setInfoModal({ isOpen: true, type: 'usage', title: '使い方' })}
              className="hover:text-zinc-900 cursor-pointer transition-colors"
            >
              使い方
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <TrendingUp size={14} />
            AI-Powered Analysis
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6"
          >
            気になる企業を、<br className="sm:hidden" />
            <span className="text-zinc-400">多角的にスコアリング。</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 max-w-3xl mx-auto"
          >
            表側の公開情報から、裏側の実態情報まで13項目で徹底比較。<br />
            あなたのキャリア選択を、データでサポートします。
          </motion.p>
        </div>

        {/* Input Section */}
        <CompanyInput onEvaluate={handleEvaluate} isLoading={isLoading} />

        {/* Progress Bar */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto mt-8"
            >
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-sm font-bold text-zinc-900">AI分析中...</div>
                    <div className="text-xs text-zinc-500 mt-1">{progress.current} / {progress.total} 社完了</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 uppercase font-bold tracking-wider">残り時間（予想）</div>
                    <div className="text-lg font-mono font-bold text-zinc-900">約{Math.ceil(progress.estimatedSeconds)}秒</div>
                  </div>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-zinc-900"
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto mt-6"
            >
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-20"
            >
              {usage && (
                <div className="max-w-5xl mx-auto mb-8 p-4 bg-zinc-900 text-zinc-400 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-amber-400" />
                      <span className="text-zinc-200 font-bold">API Usage:</span>
                    </div>
                    <span>Prompt: {usage.promptTokens}</span>
                    <span>Output: {usage.candidatesTokens}</span>
                    <span>Total: {usage.totalTokens}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-full">
                    <span className="text-zinc-500">Est. Cost:</span>
                    <span className="text-emerald-400 font-bold">${usage.estimatedCostUsd.toFixed(6)}</span>
                  </div>
                </div>
              )}
              <RankingTable 
                companies={results} 
                onShowDetail={setSelectedCompany} 
                onExportPDF={handleExportPDF}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <DetailModal 
            key={selectedCompany.name}
            company={selectedCompany} 
            onClose={() => setSelectedCompany(null)} 
          />
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <InfoModal
        isOpen={infoModal.isOpen}
        type={infoModal.type}
        title={infoModal.title}
        onClose={() => setInfoModal({ ...infoModal, isOpen: false })}
      />

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-400 text-sm">
            © 2026 Corporate Ranker. Data analysis powered by Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
