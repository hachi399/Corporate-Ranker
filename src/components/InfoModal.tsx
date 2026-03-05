import React from 'react';
import { X, HelpCircle, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'evaluation' | 'usage';
}

export default function InfoModal({ isOpen, onClose, title, type }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <div className="flex items-center gap-3">
                {type === 'evaluation' ? (
                  <BookOpen className="text-zinc-900" size={24} />
                ) : (
                  <HelpCircle className="text-zinc-900" size={24} />
                )}
                <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
              >
                <X size={24} className="text-zinc-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {type === 'evaluation' ? (
                <div className="space-y-6">
                  <section>
                    <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      スコアリングの仕組み
                    </h4>
                    <p className="text-zinc-600 text-sm leading-relaxed">
                      各項目は1〜5点の5段階で評価されます。合計点は最大65点（13項目 × 5点）となります。
                    </p>
                  </section>

                  <div className="grid gap-4">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <h5 className="font-bold text-zinc-900 text-sm mb-2">主な評価基準例</h5>
                      <ul className="text-xs text-zinc-500 space-y-2 list-disc pl-4">
                        <li><span className="font-semibold text-zinc-700">収入:</span> 1500万円以上で5点、1000万円以上で4点、800万円以上で3点...</li>
                        <li><span className="font-semibold text-zinc-700">離職率:</span> 5%未満で5点、10%未満で4点、15%未満で3点...</li>
                        <li><span className="font-semibold text-zinc-700">残業時間:</span> 10時間以下で5点、20時間以下で4点、30時間以下で3点...</li>
                        <li><span className="font-semibold text-zinc-700">男女比:</span> 女性比率40%以上で5点、30%以上で4点...</li>
                      </ul>
                    </div>
                  </div>

                  <section>
                    <h4 className="font-bold text-zinc-900 mb-2">評価項目（全13項目）</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div className="space-y-1">
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">表側（公開情報）</p>
                        <p className="text-zinc-700">・男女比</p>
                        <p className="text-zinc-700">・収入</p>
                        <p className="text-zinc-700">・企業風土</p>
                        <p className="text-zinc-700">・キャリアアップ率</p>
                        <p className="text-zinc-700">・福利厚生</p>
                        <p className="text-zinc-700">・社会貢献度</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">裏側（実態情報）</p>
                        <p className="text-zinc-700">・離職率</p>
                        <p className="text-zinc-700">・平均勤続年数</p>
                        <p className="text-zinc-700">・従業員数の推移</p>
                        <p className="text-zinc-700">・営業利益率</p>
                        <p className="text-zinc-700">・残業時間の中央値</p>
                        <p className="text-zinc-700">・昇格の透明性</p>
                        <p className="text-zinc-700">・副業・リモート許容度</p>
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="space-y-6">
                  <section>
                    <h4 className="font-bold text-zinc-900 mb-3">使い方のステップ</h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                        <div>
                          <p className="font-bold text-zinc-900 text-sm">企業名を入力</p>
                          <p className="text-zinc-500 text-xs mt-1">入力欄に気になる企業名を改行またはカンマ区切りで入力します（最大100社）。</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                        <div>
                          <p className="font-bold text-zinc-900 text-sm">AIによる分析を開始</p>
                          <p className="text-zinc-500 text-xs mt-1">「AIで評価を開始する」ボタンを押すと、Gemini AIが最新のデータを収集・分析します。進捗状況と残り時間の目安が表示されます。</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                        <div>
                          <p className="font-bold text-zinc-900 text-sm">AIによる詳細解説（新機能）</p>
                          <p className="text-zinc-500 text-xs mt-1">詳細画面で項目を<span className="font-bold text-zinc-900">ダブルクリック</span>すると、なぜそのスコアになったのかAIが個別に解説します。</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 font-bold text-sm">4</div>
                        <div>
                          <p className="font-bold text-zinc-900 text-sm">PDF出力</p>
                          <p className="text-zinc-500 text-xs mt-1">「PDFで出力」で、レーダーチャートを含むプロフェッショナルなレポートを保存できます。</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>

            <div className="px-8 py-6 bg-zinc-50 border-t border-zinc-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all"
              >
                閉じる
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
