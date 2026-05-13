import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BarChart3, Target, AlertTriangle } from 'lucide-react';

export default function DecisionSimulator() {
  const [pWin, setPWin] = useState(60);
  const [gainAmount, setGainAmount] = useState(100);
  const [lossAmount, setLossAmount] = useState(80);
  const [rounds, setRounds] = useState(100);

  const expectedValue = useMemo(() => {
    const pLose = 100 - pWin;
    return (pWin / 100) * gainAmount - (pLose / 100) * lossAmount;
  }, [pWin, gainAmount, lossAmount]);

  const evPerRound = expectedValue;
  const evTotal = evPerRound * rounds;

  const riskScore = useMemo(() => {
    const winVar = (pWin / 100) * Math.pow(gainAmount - expectedValue, 2);
    const lossVar = ((100 - pWin) / 100) * Math.pow(-lossAmount - expectedValue, 2);
    return Math.sqrt(winVar + lossVar);
  }, [pWin, gainAmount, lossAmount, expectedValue]);

  const ruinProb = useMemo(() => {
    if (lossAmount <= 0) return 0;
    const edge = (expectedValue / lossAmount);
    const r = lossAmount / (gainAmount + lossAmount);
    if (pWin / 100 <= r) return 100;
    const oddsRatio = ((pWin / 100) / r - 1) / (((100 - pWin) / 100) / (1 - r) - 1);
    if (oddsRatio <= 0) return 100;
    return Math.max(0, Math.min(100, Math.pow(1 / oddsRatio, 3) * 100));
  }, [pWin, gainAmount, lossAmount, expectedValue]);

  const verdict = useMemo(() => {
    if (lossAmount >= gainAmount * 3) return { label: '高风险', color: '#c88080', emoji: '⚠️' };
    if (expectedValue <= 0) return { label: '不推荐', color: '#c88080', emoji: '✗' };
    if (ruinProb > 30) return { label: '谨慎评估', color: '#e0c060', emoji: '⚡' };
    if (pWin >= 70 && expectedValue > 20) return { label: '强烈推荐', color: '#80c880', emoji: '✓' };
    if (expectedValue > 10) return { label: '可以参与', color: '#a0c0a0', emoji: '~' };
    return { label: '审慎考虑', color: '#e0c060', emoji: '?' };
  }, [expectedValue, pWin, lossAmount, gainAmount, ruinProb]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Brain size={18} className="text-amber" />
          <h3 className="text-xl font-serif font-semibold text-amber-light">决策模拟器</h3>
        </div>
        <p className="text-sm text-noir-400">
          输入你的概率估计，计算期望价值、风险指标和决策建议
        </p>
      </div>

      {/* 输入面板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
        <div className="p-4 rounded-xl border border-noir-700/50 bg-noir-800/30 space-y-3">
          <div>
            <label className="block text-[10px] text-noir-400 mb-1">
              胜率: {pWin}%
            </label>
            <input type="range" min="5" max="95" value={pWin}
              onChange={(e) => setPWin(Number(e.target.value))}
              className="w-full h-1.5 bg-noir-700 rounded-full accent-green-500" />
          </div>
          <div>
            <label className="block text-[10px] text-noir-400 mb-1 flex items-center justify-between">
              <span>赢时获利</span>
              <span className="text-noir-200 font-mono">{gainAmount}</span>
            </label>
            <input type="range" min="10" max="500" value={gainAmount}
              onChange={(e) => setGainAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-noir-700 rounded-full accent-amber" />
          </div>
        </div>
        <div className="p-4 rounded-xl border border-noir-700/50 bg-noir-800/30 space-y-3">
          <div>
            <label className="block text-[10px] text-noir-400 mb-1 flex items-center justify-between">
              <span>输时损失</span>
              <span className="text-noir-200 font-mono">{lossAmount}</span>
            </label>
            <input type="range" min="10" max="500" value={lossAmount}
              onChange={(e) => setLossAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-noir-700 rounded-full accent-red-500" />
          </div>
          <div>
            <label className="block text-[10px] text-noir-400 mb-1 flex items-center justify-between">
              <span>模拟轮数</span>
              <span className="text-noir-200 font-mono">{rounds}</span>
            </label>
            <input type="range" min="10" max="1000" step="10" value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full h-1.5 bg-noir-700 rounded-full accent-blue-500" />
          </div>
        </div>
      </div>

      {/* 结论 */}
      <motion.div
        key={verdict.label}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg mx-auto p-5 rounded-xl border border-noir-700/50 bg-noir-800/30 text-center"
      >
        <span className="text-2xl">{verdict.emoji}</span>
        <h4 className="text-lg font-serif font-semibold mt-1 mb-1" style={{ color: verdict.color }}>
          {verdict.label}
        </h4>
        <p className="text-xs text-noir-400">
          单次期望价值: {evPerRound.toFixed(1)} · {rounds}次模拟总期望: {evTotal.toFixed(0)}
        </p>
      </motion.div>

      {/* 指标面板 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
        {[
          { label: '期望价值', value: evPerRound.toFixed(1), icon: BarChart3, color: evPerRound >= 0 ? '#c8a44e' : '#c88080' },
          { label: '风险(σ)', value: riskScore.toFixed(1), icon: AlertTriangle, color: riskScore > 80 ? '#c88080' : '#808080' },
          { label: '总期望', value: evTotal.toFixed(0), icon: Target, color: evTotal >= 0 ? '#a0c0a0' : '#c88080' },
          { label: '破产风险', value: ruinProb.toFixed(0) + '%', icon: Target, color: ruinProb > 50 ? '#c88080' : ruinProb > 20 ? '#e0c060' : '#80c080' },
        ].map((metric) => (
          <motion.div key={metric.label} whileHover={{ scale: 1.05 }}
            className="p-3 rounded-xl bg-noir-800/70 border border-noir-700/30 text-center">
            <metric.icon size={14} className="mx-auto mb-1" style={{ color: metric.color }} />
            <p className="text-[9px] text-noir-500">{metric.label}</p>
            <p className="text-sm font-mono mt-0.5" style={{ color: metric.color }}>{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 决策铁律 */}
      <div className="max-w-lg mx-auto p-4 rounded-xl border border-amber/20 bg-noir-800/30">
        <h4 className="text-[10px] text-amber/60 mb-2 tracking-wider">决策铁律</h4>
        <ul className="space-y-1.5 text-[10px] text-noir-400">
          <li className="flex gap-2"><span className="text-amber shrink-0">1.</span> 永远不做「输了就出局」的决策——破产风险需严格控制在30%以内</li>
          <li className="flex gap-2"><span className="text-amber shrink-0">2.</span> 期望价值为正 ≠ 可以无限下注——需控制单次损失上限</li>
          <li className="flex gap-2"><span className="text-amber shrink-0">3.</span> 高风险的高波动抵消复利效应——善战者无赫赫之功</li>
          <li className="flex gap-2"><span className="text-amber shrink-0">4.</span> 评估参数需参考外部视角——你不特殊，善用参考类预测校准</li>
        </ul>
      </div>
    </div>
  );
}