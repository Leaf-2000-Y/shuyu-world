import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Calculator } from 'lucide-react';

export default function ProspectCurve() {
  const [refPoint, setRefPoint] = useState(50);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonRef, setComparisonRef] = useState(75);

  const width = 520;
  const height = 320;
  const padding = 45;
  const midY = height / 2;

  const refX = padding + (refPoint / 100) * (width - padding * 2);
  const compX = padding + (comparisonRef / 100) * (width - padding * 2);

  const subjectiveValue = useMemo(() => {
    const gain = hoveredValue !== null ? hoveredValue : refPoint;
    if (gain === refPoint) return 0;
    const dx = (gain - refPoint) / 100;
    return dx >= 0 ? Math.pow(dx, 0.8) * 0.6 : -Math.pow(Math.abs(dx), 0.7) * 1.4;
  }, [hoveredValue, refPoint]);

  const generateCurve = (ref: number) => {
    const pts: string[] = [];
    const steps = 120;
    const rX = padding + (ref / 100) * (width - padding * 2);
    for (let i = 0; i <= steps; i++) {
      const x = padding + (i / steps) * (width - padding * 2);
      const dx = (x - rX) / 100;
      const val = dx >= 0 ? Math.pow(dx, 0.8) * 0.6 : -Math.pow(Math.abs(dx), 0.7) * 1.4;
      const y = midY - val * 140;
      pts.push(`${x},${Math.max(padding - 10, Math.min(height - padding + 10, y))}`);
    }
    return pts.join(' ');
  };

  const curvePath = generateCurve(refPoint);
  const compCurvePath = generateCurve(comparisonRef);

  const dataPoints = [10, 25, 40, 60, 75, 90].map((p) => {
    const dx = (p - refPoint) / 100;
    const val = dx >= 0 ? Math.pow(dx, 0.8) * 0.6 : -Math.pow(Math.abs(dx), 0.7) * 1.4;
    const x = padding + (p / 100) * (width - padding * 2);
    const y = midY - val * 140;
    return { pct: p, x, y: Math.max(padding - 10, Math.min(height - padding + 10, y)), val };
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-serif font-semibold text-amber-light mb-2">前景理论 S 曲线</h3>
        <p className="text-sm text-noir-400">
          调节参照点滑块 · 悬停数据点 · 开启历史对比模式
        </p>
      </div>

      <div className="flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-xl">
          {/* 背景网格 */}
          {[0.25, 0.5, 0.75].map((p) => (
            <line key={`h-${p}`} x1={padding} y1={midY + (1 - p) * 120} x2={width - padding} y2={midY + (1 - p) * 120} stroke="#1a1a1a" strokeWidth="0.5" />
          ))}
          {[0.25, 0.5, 0.75].map((p) => (
            <line key={`v-${p}`} x1={padding + p * (width - padding * 2)} y1={padding} x2={padding + p * (width - padding * 2)} y2={height - padding} stroke="#1a1a1a" strokeWidth="0.5" />
          ))}

          {/* 零轴 */}
          <line x1={padding} y1={midY} x2={width - padding} y2={midY} stroke="#404040" strokeWidth="1" />
          <text x={width - padding} y={midY - 8} fill="#606060" fontSize="9" textAnchor="end">客观损益</text>
          <text x={refX + 8} y={padding + 12} fill="#606060" fontSize="9">主观价值</text>

          {/* 区域标签 */}
          <text x={refX + 60} y={midY - 10} fill="rgba(200,164,78,0.6)" fontSize="9">收益区 +</text>
          <text x={refX + 60} y={midY + 18} fill="rgba(200,100,100,0.5)" fontSize="9">损失区 -</text>

          {/* 比较曲线（虚线） */}
          <AnimatePresence>
            {showComparison && (
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                d={`M${compCurvePath}`}
                fill="none"
                stroke="rgba(120,160,200,0.4)"
                strokeWidth="1.5"
                strokeDasharray="6,3"
              />
            )}
          </AnimatePresence>

          {/* 主 S 曲线 */}
          <path d={`M${padding},${midY + 140} L${curvePath} L${width - padding},${midY - 140}`} fill="none" stroke="#c8a44e" strokeWidth="2" />

          {/* 损失厌恶标注 */}
          <AnimatePresence>
            {!showComparison && (
              <g>
                <line x1={refX + 80} y1={midY - 30} x2={refX + 80} y2={midY - 70} stroke="rgba(200,164,78,0.5)" strokeWidth="1" markerEnd="url(#arrG)" />
                <text x={refX + 95} y={midY - 50} fill="rgba(200,164,78,0.5)" fontSize="8">+收益</text>
                <line x1={refX - 70} y1={midY + 25} x2={refX - 70} y2={midY + 65} stroke="rgba(200,100,100,0.5)" strokeWidth="1" markerEnd="url(#arrL)" />
                <text x={refX - 95} y={midY + 50} fill="rgba(200,100,100,0.5)" fontSize="8">-损失</text>
              </g>
            )}
          </AnimatePresence>

          {/* 参照点标记 */}
          <circle cx={refX} cy={midY} r="5" fill="#c8a44e" stroke="#0a0a0a" strokeWidth="1.5" />
          <text x={refX} y={midY + 18} fill="#c8a44e" fontSize="9" textAnchor="middle" fontWeight="600">参照点</text>

          {/* 比较参照点 */}
          <AnimatePresence>
            {showComparison && (
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                cx={compX} cy={midY} r="4" fill="none" stroke="rgba(120,160,200,0.6)" strokeWidth="1.5" />
            )}
          </AnimatePresence>

          {/* 可交互数据点 */}
          {dataPoints.map((dp) => (
            <g key={dp.pct}>
              <circle
                cx={dp.x} cy={dp.y} r="5"
                fill={hoveredValue === dp.pct ? '#c8a44e' : 'transparent'}
                stroke={hoveredValue === dp.pct ? '#c8a44e' : 'rgba(200,164,78,0.3)'}
                strokeWidth="1.5"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredValue(dp.pct)}
                onMouseLeave={() => setHoveredValue(null)}
              />
              <AnimatePresence>
                {hoveredValue === dp.pct && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <rect x={dp.x - 35} y={dp.y - 32} width="70" height="28" rx="4" fill="#1a1a1a" stroke="#404040" />
                    <text x={dp.x} y={dp.y - 18} textAnchor="middle" fill="#c8a44e" fontSize="9">
                      损益: {dp.pct > refPoint ? '+' : ''}{Math.round((dp.pct - refPoint) / refPoint * 100)}%
                    </text>
                    <text x={dp.x} y={dp.y - 6} textAnchor="middle" fill="#808080" fontSize="8">
                      价值: {(dp.val * 100).toFixed(0)}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          ))}

          <defs>
            <marker id="arrG" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M0 0 L10 5 L0 10z" fill="rgba(200,164,78,0.5)" />
            </marker>
            <marker id="arrL" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M0 0 L10 5 L0 10z" fill="rgba(200,100,100,0.5)" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* 控制面板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
        <div className="space-y-3">
          <label className="block text-xs text-noir-400 text-center">
            主参照点: {refPoint}%
          </label>
          <input type="range" min="5" max="95" value={refPoint}
            onChange={(e) => setRefPoint(Number(e.target.value))}
            className="w-full h-1.5 bg-noir-700 rounded-full accent-amber" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-noir-400">历史对比模式</label>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-3 py-1 rounded-full text-[10px] transition-colors ${
                showComparison ? 'bg-amber/10 border border-amber/50 text-amber' : 'border border-noir-600 text-noir-500'
              }`}
            >
              {showComparison ? '开启中' : '关闭'}
            </button>
          </div>
          <AnimatePresence>
            {showComparison && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <label className="block text-xs text-noir-400 text-center">
                  对比参照点: {comparisonRef}%
                </label>
                <input type="range" min="5" max="95" value={comparisonRef}
                  onChange={(e) => setComparisonRef(Number(e.target.value))}
                  className="w-full h-1.5 bg-noir-700 rounded-full accent-blue-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 实时计算面板 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="p-5 rounded-xl border border-noir-700/50 bg-noir-800/30 max-w-lg mx-auto"
      >
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={14} className="text-amber" />
          <h4 className="text-sm font-semibold text-amber-light">实时损益计算</h4>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-noir-800/70">
            <p className="text-[10px] text-noir-500">参照点</p>
            <p className="text-sm text-noir-100 font-mono">{refPoint}%</p>
          </div>
          <div className="p-2 rounded-lg bg-noir-800/70">
            <p className="text-[10px] text-noir-500">主观价值</p>
            <p className="text-sm font-mono" style={{ color: subjectiveValue >= 0 ? '#c8a44e' : '#c88080' }}>
              {(subjectiveValue * 100).toFixed(0)}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-noir-800/70">
            <p className="text-[10px] text-noir-500">损失厌恶倍数</p>
            <p className="text-sm text-noir-100 font-mono">~2.0x</p>
          </div>
        </div>
        <p className="text-[10px] text-noir-500 mt-3 text-center">
          相同幅度的损失带来的痛苦约为收益带来的快乐的 2 倍
        </p>
      </motion.div>

      {/* 理论说明 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: '损失厌恶', desc: '曲线在损失区域比收益区域更陡峭。损失100元的痛苦≈获得200元快乐的强度。' },
          { title: '参照点依赖', desc: '人判断盈亏看的是相对于参照点的变化，而非绝对值。换个参照点，感受完全不同。' },
          { title: '敏感度递减', desc: '离参照点越远，新增变化带来的感知差异越小。赚第一个100万和第二个100万，感受截然不同。' },
          { title: '框架效应', desc: '如何描述同一件事，决定了别人选择什么。这是叙事权最直接的体现。' },
        ].map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl border border-amber/20 bg-noir-800/50">
            <div className="flex items-center gap-2 mb-2">
              {i < 2 ? <TrendingUp size={12} className="text-amber" /> : <TrendingDown size={12} className="text-amber/60" />}
              <h4 className="text-sm font-semibold text-amber-light">{card.title}</h4>
            </div>
            <p className="text-xs text-noir-300 leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}