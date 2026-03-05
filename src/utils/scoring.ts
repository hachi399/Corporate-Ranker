import { RawCompanyData } from '../types';

export function calculateScores(data: RawCompanyData) {
  const scores: Record<string, number> = {};

  // 1. 男女比 (Higher is better for this specific youth-focused app requirement)
  scores.genderRatio = scoreLinear(data.genderRatio, [40, 30, 20, 10]);
  
  // 2. 収入 (10k JPY)
  scores.income = scoreLinear(data.income, [1500, 1000, 800, 500]);
  
  // 3. 企業風土 (1.0 - 5.0)
  scores.culture = scoreLinear(data.culture, [4.0, 3.5, 3.0, 2.5]);
  
  // 4. キャリアアップ率 (1.0 - 5.0)
  scores.career = scoreLinear(data.career, [4.0, 3.5, 3.0, 2.5]);
  
  // 5. 福利厚生 (1.0 - 5.0)
  scores.welfare = scoreLinear(data.welfare, [4.0, 3.5, 3.0, 2.5]);
  
  // 6. 社会貢献度
  scores.social = scoreCategorical(data.social, ["top20", "top40", "middle", "bottom40"]);

  // 7. 離職率 (Lower is better)
  scores.turnoverRate = scoreInverted(data.turnoverRate, [5, 10, 15, 20]);
  
  // 8. 平均勤続年数
  scores.avgTenure = scoreLinear(data.avgTenure, [15, 12, 10, 8]);
  
  // 9. 従業員数の推移
  scores.employeeTrend = scoreCategorical(data.employeeTrend, ["5up", "4up", "flat", "2down"]);
  
  // 10. 営業利益率
  scores.profitMargin = scoreLinear(data.profitMargin, [15, 10, 5, 3]);
  
  // 11. 残業時間 (Lower is better)
  scores.medianOvertime = scoreInverted(data.medianOvertime, [10, 20, 30, 40]);
  
  // 12. 昇格の透明性
  scores.promotionTransparency = scoreLinear(data.promotionTransparency, [4.0, 3.5, 3.0, 2.5]);
  
  // 13. 副業・リモート
  scores.remoteFlex = scoreCategorical(data.remoteFlex, ["free", "high", "mid", "low"]);

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  return { scores, total };
}

function scoreLinear(val: number, thresholds: number[]): number {
  if (val >= thresholds[0]) return 5;
  if (val >= thresholds[1]) return 4;
  if (val >= thresholds[2]) return 3;
  if (val >= thresholds[3]) return 2;
  return 1;
}

function scoreInverted(val: number, thresholds: number[]): number {
  if (val <= thresholds[0]) return 5;
  if (val <= thresholds[1]) return 4;
  if (val <= thresholds[2]) return 3;
  if (val <= thresholds[3]) return 2;
  return 1;
}

function scoreCategorical(val: string | number, categories: string[]): number {
  const index = categories.indexOf(String(val));
  if (index === 0) return 5;
  if (index === 1) return 4;
  if (index === 2) return 3;
  if (index === 3) return 2;
  return 1;
}
