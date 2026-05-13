import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Zap, Info } from 'lucide-react';

interface UncertaintyType {
  id: string;
  name: string;
  scholar: string;
  description: string;
  example: string;
  angle: number;
  color: string;
  implications: string[];
}

const uncertaintyTypes: UncertaintyType[] = [
  {
    id: 'chaos', name: '混沌', scholar: 'Lorenz',
    description: '复杂系统对初始条件极度敏感。微小测量误差在时间中被迅速放大，使长期预测在数学上不可能。',
    example: '蝴蝶效应：巴西的蝴蝶扇动翅膀可能导致德克萨斯州的龙卷风。',
    angle: 0, color: '#c8a44e',
    implications: ['短期预测可行，长期预测无效', '需要建立弹性系统，而非精确模型', '关注系统状态而非精确数值'],
  },
  {
    id: 'irreducibility', name: '计算不可约性', scholar: 'Wolfram',
    description: '某些系统没有捷径：你只能让它一步步演化才能知道结果。无法用简单公式代替完整模拟。',
    example: '图灵机停机问题：你甚至无法事先判断一个算法能不能算完。',
    angle: 72, color: '#a0b090',
    implications: ['某些答案只能等待，无法提前计算', '模拟演化的价值大于理论推导', '接受\"走着瞧\"作为有效策略'],
  },
  {
    id: 'quantum', name: '量子随机', scholar: 'Born',
    description: '自然界固有的不确定性。原子核何时衰变、电子落点在哪——事情发生前，自然自己也不知道。',
    example: '薛定谔的猫：在观测之前，猫同时处于死和活的叠加态。',
    angle: 144, color: '#8ab4d8',
    implications: ['世界底层是非决定论的', '观测行为本身改变结果', '随机性不是知识的缺失，而是自然的本性'],
  },
  {
    id: 'knightian', name: '奈特不确定性', scholar: 'Knight',
    description: '你的模型之外存在你完全不知道的变量。如果未来出现了全新的技术范式，旧模型的预测就毫无意义。',
    example: '在智能手机出现前，没人能预测它对传统手机行业的颠覆。',
    angle: 216, color: '#c88888',
    implications: ['永远保留冗余和安全边际', '不要过度优化已知模型', '保持对新范式的敏感度'],
  },
  {
    id: 'reflexivity', name: '反身性', scholar: 'Soros',
    description: '你一旦说出未来，就会改变未来。人类系统中的预测行为本身会改变被预测的系统。',
    example: '如果所有人相信明天股市崩盘，崩盘就会在今天发生。',
    angle: 288, color: '#b890c0',
    implications: ['发布预测就是施加影响', '叙事本身就是行动工具', '自我实现预言 vs 自我否定预言'],
  },
];

export default function UncertaintyViz() {
  const [activeId, setActiveId] = useState<string>('chaos');
  const [showAllDetails, setShowAllDetails] = useState(false);
  const cx = 260;
  const cy = 260;
  const radius = 155;
  const nodeRadius = 28;

  const getCoords = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const active = uncertaintyTypes.find((t) => t.id === activeId)!;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-serif font-semibold text-amber-light mb-2">五种不确定性</h3>
        <p className="text-sm text-noir-400">
          点击节点查看详情 · 开启联动模式查看全局关系
        </p>
      </div>

      <div className="flex justify-center">
        <svg viewBox={`0 0 ${cx * 2} ${cy * 2}`} className="w-full max-w-md">
          {/* 多边形连线 */}
          {uncertaintyTypes.map((t, i) => {
            const next = uncertaintyTypes[(i + 1) % uncertaintyTypes.length];
            const a = getCoords(t.angle);
            const b = getCoords(next.angle);
            return (
              <g key={`edge-${t.id}`}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={activeId === t.id || activeId === next.id ? t.color : '#2a2a2a'}
                  strokeWidth={activeId === t.id || activeId === next.id ? 1.8 : 0.8}
                  opacity={activeId === t.id || activeId === next.id ? 0.6 : 0.3} />
                {showAllDetails && (
                  <motion.circle r="3"
                    fill={t.color}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <animateMotion dur="2s" repeatCount="indefinite" path={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />
                  </motion.circle>
                )}
              </g>
            );
          })}

          {/* 中心到节点连线 */}
          {uncertaintyTypes.map((t) => {
            const coord = getCoords(t.angle);
            const isActive = t.id === activeId;
            return (
              <g key={`center-${t.id}`}>
                <line x1={cx} y1={cy} x2={coord.x} y2={coord.y}
                  stroke={isActive ? t.color : '#2a2a2a'}
                  strokeWidth={isActive ? 1.5 : 0.8}
                  opacity={isActive ? 0.6 : 0.2} />
                {isActive && (
                  <motion.circle r="2" fill={t.color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}>
                    <animateMotion dur="1.5s" repeatCount="indefinite"
                      path={`M ${cx} ${cy} L ${coord.x} ${coord.y}`} />
                  </motion.circle>
                )}
              </g>
            );
          })}

          {/* 中心节点 */}
          <circle cx={cx} cy={cy} r="38" fill="#0a0a0a" stroke="#404040" strokeWidth="1" />
          <motion.circle cx={cx} cy={cy} r="38" fill="none" stroke={active.color}
            strokeWidth="1" opacity="0.3"
            animate={{ r: [38, 50, 38], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }} />
          <text x={cx} y={cy - 8} textAnchor="middle" fill="#c8a44e" fontSize="10" fontWeight="600">不确定</text>
          <text x={cx} y={cy + 6} textAnchor="middle" fill="#606060" fontSize="7">性内核</text>

          {/* 周围节点 */}
          {uncertaintyTypes.map((t) => {
            const coord = getCoords(t.angle);
            const isActive = t.id === activeId;
            return (
              <g key={t.id} onClick={() => setActiveId(t.id)} className="cursor-pointer">
                {isActive && (
                  <motion.circle cx={coord.x} cy={coord.y} r={nodeRadius + 8}
                    fill="none" stroke={t.color} strokeWidth="1" opacity="0.2"
                    animate={{ r: [nodeRadius + 8, nodeRadius + 18, nodeRadius + 8], opacity: [0.2, 0, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }} />
                )}
                <circle cx={coord.x} cy={coord.y} r={nodeRadius}
                  fill={isActive ? t.color : '#1a1a1a'}
                  stroke={isActive ? t.color : '#404040'}
                  strokeWidth={isActive ? 2 : 1}
                  opacity={isActive ? 1 : 0.8} />
                <text x={coord.x} y={coord.y} textAnchor="middle"
                  fill={isActive ? '#0a0a0a' : '#808080'}
                  fontSize="10" fontWeight="600" dy="0.35em">{t.name}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 联动切换 */}
      <div className="text-center">
        <button
          onClick={() => setShowAllDetails(!showAllDetails)}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-colors ${
            showAllDetails ? 'bg-amber/10 border border-amber/50 text-amber' : 'border border-noir-600 text-noir-500'
          }`}
        >
          <Network size={12} /> {showAllDetails ? '联动模式开启' : '联动模式关闭'}
        </button>
      </div>

      {/* 详情卡片 */}
      <AnimatePresence mode="wait">
        <motion.div key={activeId} initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-xl border border-noir-700/50 bg-noir-800/30 max-w-lg mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: active.color }} />
            <h4 className="text-lg font-serif font-semibold text-noir-100">{active.name}</h4>
            <span className="text-xs text-noir-500">— {active.scholar}</span>
          </div>
          <p className="text-sm text-noir-300 leading-relaxed">{active.description}</p>
          <div className="p-3 rounded-lg bg-noir-800/50 border border-noir-700/30">
            <p className="text-xs text-noir-400 italic">「{active.example}」</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={12} className="text-amber" />
              <p className="text-[10px] text-amber/60">行动启示</p>
            </div>
            <ul className="space-y-1">
              {active.implications.map((imp, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-xs text-noir-400 flex items-start gap-1.5">
                  <span className="text-amber/40 mt-0.5">→</span> {imp}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}