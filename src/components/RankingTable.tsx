import React from 'react';
import { FileText, Info, Download } from 'lucide-react';
import { CompanyScore, EVALUATION_ITEMS } from '../types';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Props {
  companies: CompanyScore[];
  onShowDetail: (company: CompanyScore) => void;
  onExportPDF: () => void;
}

export default function RankingTable({ companies, onShowDetail, onExportPDF }: Props) {
  const getChartData = (company: CompanyScore) => {
    const allItems = [...EVALUATION_ITEMS.front, ...EVALUATION_ITEMS.back];
    return allItems.map(item => ({
      subject: (item as any).englishLabel || item.label,
      fullMark: 5,
      value: company.scores[item.id]
    }));
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto mt-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900">評価ランキング</h2>
          <p className="text-zinc-500 mt-2 text-lg">13項目（計65点満点）による総合評価結果</p>
        </div>
        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm active:scale-95"
        >
          <Download size={18} />
          PDFで出力
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xl shadow-zinc-200/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest w-24">順位</th>
              <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">企業名 & 評価チャート</th>
              <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest text-center w-40">総合スコア</th>
              <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right w-40">アクション</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {companies.map((company, index) => (
              <motion.tr
                key={company.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-zinc-50/30 transition-colors group"
              >
                <td className="px-8 py-8 align-top">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl font-black text-lg ${
                    index === 0 ? 'bg-amber-100 text-amber-700' : 
                    index === 1 ? 'bg-zinc-100 text-zinc-700' : 
                    index === 2 ? 'bg-orange-100 text-orange-700' : 
                    'text-zinc-300'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-8 py-8">
                  <div className="flex flex-col xl:flex-row gap-10 items-start">
                    <div className="min-w-[280px]">
                      <div className="font-bold text-zinc-900 text-2xl tracking-tight">{company.name}</div>
                      <div className="text-sm text-zinc-400 mt-2 font-medium">{company.raw.englishName}</div>
                    </div>
                    
                    <div id={`chart-${index}`} className="w-full h-64 max-w-[450px] rounded-3xl p-4" style={{ backgroundColor: '#f8fafc' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getChartData(company)}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                          <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                          <Radar
                            name={company.name}
                            dataKey="value"
                            stroke="#0f172a"
                            fill="#0f172a"
                            fillOpacity={0.1}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-8 text-center align-top">
                  <div className="inline-flex items-baseline gap-1 bg-zinc-50 px-4 py-2 rounded-2xl">
                    <span className="text-3xl font-black text-zinc-900">{company.total}</span>
                    <span className="text-zinc-400 text-sm font-bold">/ 65</span>
                  </div>
                </td>
                <td className="px-8 py-8 text-right align-top">
                  <button
                    onClick={() => onShowDetail(company)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all active:scale-95"
                  >
                    <Info size={18} />
                    詳細
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
