export interface RawCompanyData {
  name: string;
  englishName: string;
  genderRatio: number; // % of women
  income: number; // Average annual income in 10k JPY
  culture: number; // 1.0 - 5.0
  career: number; // 1.0 - 5.0
  welfare: number; // 1.0 - 5.0
  social: number; // percentile or rank (top20, top40, etc)
  turnoverRate: number; // %
  avgTenure: number; // years
  employeeTrend: string; // 5up, 4up, flat, 2down
  profitMargin: number; // %
  medianOvertime: number; // hours/month
  promotionTransparency: number; // 1.0 - 5.0
  remoteFlex: string; // free, high, mid, low
  sources: Record<string, string>; // URL for each metric ID
}

export interface CompanyScore {
  name: string;
  scores: Record<string, number>;
  total: number;
  raw: RawCompanyData;
}

export interface ApiUsage {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export const EVALUATION_ITEMS = {
  front: [
    { id: 'genderRatio', label: '男女比', englishLabel: 'Gender Ratio', description: '女性比率が高いほど高評価' },
    { id: 'income', label: '収入', englishLabel: 'Income', description: '平均年収が高いほど高評価' },
    { id: 'culture', label: '企業風土', englishLabel: 'Culture', description: '社員の満足度や風通しの良さ' },
    { id: 'career', label: 'キャリアアップ率', englishLabel: 'Career Growth', description: '成長機会やスキルアップの環境' },
    { id: 'welfare', label: '福利厚生', englishLabel: 'Welfare', description: '手当や休暇制度の充実度' },
    { id: 'social', label: '社会貢献度', englishLabel: 'Social Contribution', description: 'ESG投資や社会へのインパクト' },
  ],
  back: [
    { id: 'turnoverRate', label: '離職率', englishLabel: 'Turnover Rate', description: '離職率が低いほど高評価' },
    { id: 'avgTenure', label: '平均勤続年数', englishLabel: 'Avg Tenure', description: '長く働ける環境かどうか' },
    { id: 'employeeTrend', label: '従業員数の推移', englishLabel: 'Employee Trend', description: '組織の拡大・安定性' },
    { id: 'profitMargin', label: '営業利益率', englishLabel: 'Profit Margin', description: '企業の収益性と安定性' },
    { id: 'medianOvertime', label: '残業時間の中央値', englishLabel: 'Overtime', description: 'ワークライフバランスの実態' },
    { id: 'promotionTransparency', label: '昇格の透明性', englishLabel: 'Promotion Transparency', description: '評価制度の納得感' },
    { id: 'remoteFlex', label: '副業・リモート許容度', englishLabel: 'Remote/Side-job Flex', description: '働き方の柔軟性' },
  ]
};
