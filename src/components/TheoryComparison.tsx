import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Theory {
  name: string;
  corePillar: string;
  strengths: string[];
  limitations: string[];
  bestFit: string;
}

const theories: Theory[] = [
  {
    name: '复杂自适应系统',
    corePillar: '相互关联 · 滞后效应 · 反馈回路 · 临界点',
    strengths: ['系统性全景视角', '解释非线性突变', '预测连锁反应'],
    limitations: ['操作门槛高', '需要大量数据支撑', '短期精度有限'],
    bestFit: '长期战略规划、生态系统分析、政策设计',
  },
  {
    name: '幂律分布与极端斯坦',
    corePillar: '头部通吃 · 非线性回报 · 正反馈放大',
    strengths: ['解释财富/流量不平等', '指导赛道选择', '识别杠杆点'],
    limitations: ['忽略公平维度', '不适合稳态系统', '可能导致投机心态'],
    bestFit: '创业赛道选择、内容平台策略、投资决策',
  },
  {
    name: '概率分布决策',
    corePillar: '期望价值 · 概率思维 · 损失上限控制',
    strengths: ['量化不确定性', '避免毁灭性风险', '长期胜率最优'],
    limitations: ['概率难以精确估计', '忽略质的差异', '需要大量重复'],
    bestFit: '投资决策、资源配置、AB测试',
  },
  {
    name: '多阶思维',
    corePillar: '一阶即时 · 二阶滞后 · 三阶系统',
    strengths: ['避免短视陷阱', '发现隐藏红利', '系统性最优解'],
    limitations: ['认知负荷大', '过度分析可能瘫痪行动', '高阶结果难以验证'],
    bestFit: '重大人生决策、产品设计、政策制定',
  },
  {
    name: '反脆弱',
    corePillar: '从波动获益 · 杠铃策略 · 可选择性',
    strengths: ['极端事件保护', '不对称收益', '进化适应性'],
    limitations: ['需要冗余资源', '不适合所有领域', '可能被误解为冒险'],
    bestFit: '创业策略、技术架构、职业规划',
  },
  {
    name: '结构决定行为',
    corePillar: '最小阻力路径 · 环境预设 · 自动化系统',
    strengths: ['不依赖意志力', '持续性高', '可复制性强'],
    limitations: ['初始设计成本高', '灵活性受限', '环境变化后需重建'],
    bestFit: '习惯培养、团队管理、产品流程设计',
  },
];

export default function TheoryComparison() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const compareRows = useMemo(() => {
    if (selected.length < 2) return null;
    const selectedTheories = theories.filter((t) => selected.includes(t.name));
    const rows: { label: string; values: string[] }[] = [
      { label: '核心支柱', values: selectedTheories.map((t) => t.corePillar) },
      { label: '核心优势', values: selectedTheories.map((t) => t.strengths[0]) },
      { label: '主要局限', values: selectedTheories.map((t) => t.limitations[0]) },
      { label: '最佳场景', values: selectedTheories.map((t) => t.bestFit) },
    ];
    return { headers: selectedTheories.map((t) => t.name), rows };
  }, [selected]);

  return (
    <div className="space-y-8">
      <p className="text-center text-noir-400 text-sm">选择 2-4 个理论进行对比分析</p>

      <div className="flex flex-wrap justify-center gap-3">
        {theories.map((t) => {
          const isSelected = selected.includes(t.name);
          return (
            <motion.button
              key={t.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(t.name)}
              className={`px-4 py-2.5 rounded-full text-xs tracking-wide transition-all duration-300 ${
                isSelected
                  ? 'bg-amber/10 border border-amber/50 text-amber'
                  : 'border border-noir-700 text-noir-400 hover:text-noir-200 hover:border-noir-500'
              }`}
            >
              {t.name}
            </motion.button>
          );
        })}
      </div>

      {compareRows && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto"
        >
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left text-amber-light border-b border-noir-700 w-24">维度</th>
                {compareRows.headers.map((h) => (
                  <th key={h} className="p-3 text-left text-noir-100 font-semibold border-b border-noir-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-noir-800/20' : ''}>
                  <td className="p-3 text-noir-400 border-b border-noir-800">{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j} className="p-3 text-noir-200 border-b border-noir-800 leading-relaxed">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {selected.length > 0 && selected.length < 2 && (
        <p className="text-center text-xs text-amber/50">请至少再选择一个理论进行对比</p>
      )}
    </div>
  );
}