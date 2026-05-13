import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Principle {
  id: string;
  name: string;
  core: string;
  layer: string;
  connections: string[];
}

const principles: Principle[] = [
  { id: 'p1', name: '复杂自适应系统', core: '世界是不可分割的关联整体，滞后效应、反馈回路、临界点决定系统行为', layer: 'Layer 1', connections: ['p2', 'p4'] },
  { id: 'p2', name: '幂律分布认知', core: '资源向头部聚集，二八法则无限嵌套，非线性回报是常态', layer: 'Layer 1', connections: ['p1', 'p3'] },
  { id: 'p3', name: '概率分布决策', core: '期望价值 = 收益×概率 - 损失×概率，不做输了就出局的决策', layer: 'Layer 3', connections: ['p2', 'p4', 'p6'] },
  { id: 'p4', name: '多阶思维', core: '一阶看即时，二阶看滞后，三阶看系统；牺牲一阶好处换三阶红利', layer: 'Layer 3', connections: ['p1', 'p3'] },
  { id: 'p5', name: '可信度加权', core: '观点的权重与可信度成正比，整合多元视角打破认知闭环', layer: 'Layer 2', connections: ['p6', 'p8'] },
  { id: 'p6', name: '激进事实与透明', core: '坏消息是进化信号，360度反馈，不让情绪过滤信息', layer: 'Layer 2', connections: ['p5', 'p7'] },
  { id: 'p7', name: '痛苦+反思=进步', core: '拥抱痛苦作为成长燃料，深度反思而非表面归因', layer: 'Layer 2', connections: ['p6', 'p8'] },
  { id: 'p8', name: '实事求是', core: '从实际出发，具体问题具体分析，不自欺不幻想', layer: 'Layer 1+2', connections: ['p5', 'p7', 'p9'] },
  { id: 'p9', name: '矛盾分析', core: '识别主要矛盾与矛盾主要方面，矛盾的普遍性与特殊性统一', layer: 'Layer 1', connections: ['p1', 'p8'] },
  { id: 'p10', name: '反脆弱与不对称', core: '从波动中获益，绝对避免毁灭性风险，采用杠铃策略', layer: 'Layer 1+3', connections: ['p1', 'p3'] },
  { id: 'p11', name: '结构决定行为', core: '能量沿最小阻力路径流动，设计环境让正确行动自动化', layer: 'Layer 4', connections: ['p12', 'p4'] },
  { id: 'p12', name: '自由公式', core: '专长×杠杆×判断力=财富，复利是第八大奇迹，联机学习指数增长', layer: 'Layer 4', connections: ['p11', 'p3'] },
];

const positions: Record<string, { x: number; y: number }> = {
  p1: { x: 250, y: 50 },
  p2: { x: 430, y: 70 },
  p3: { x: 550, y: 200 },
  p4: { x: 380, y: 180 },
  p5: { x: 120, y: 200 },
  p6: { x: 50, y: 320 },
  p7: { x: 180, y: 400 },
  p8: { x: 300, y: 370 },
  p9: { x: 150, y: 100 },
  p10: { x: 500, y: 350 },
  p11: { x: 250, y: 500 },
  p12: { x: 420, y: 480 },
};

export default function PrincipleNetwork() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const active = hoveredId ? principles.find((p) => p.id === hoveredId) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <svg viewBox="0 0 620 560" className="w-full max-w-xl">
          {/* 连线 */}
          {principles.map((p) =>
            p.connections.map((conn) => {
              const from = positions[p.id];
              const to = positions[conn];
              if (!from || !to) return null;
              const isActive = hoveredId === p.id || hoveredId === conn;
              return (
                <line
                  key={`${p.id}-${conn}`}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={isActive ? '#c8a44e' : '#2a2a2a'}
                  strokeWidth={isActive ? 1.5 : 0.8}
                  opacity={hoveredId ? (isActive ? 0.7 : 0.1) : 0.4}
                />
              );
            })
          )}

          {/* 节点 */}
          {principles.map((p) => {
            const pos = positions[p.id];
            if (!pos) return null;
            const isActive = hoveredId === p.id;
            const isDimmed = hoveredId && hoveredId !== p.id && !p.connections.includes(hoveredId) && !(active?.connections.includes(p.id));
            return (
              <g
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer"
                style={{ opacity: isDimmed ? 0.3 : 1, transition: 'opacity 0.3s' }}
              >
                <circle
                  cx={pos.x} cy={pos.y}
                  r={isActive ? 22 : 16}
                  fill={isActive ? '#c8a44e' : '#1a1a1a'}
                  stroke={isActive ? '#c8a44e' : '#404040'}
                  strokeWidth={isActive ? 2 : 1}
                />
                <text
                  x={pos.x} y={pos.y}
                  textAnchor="middle"
                  fill={isActive ? '#0a0a0a' : '#808080'}
                  fontSize="8"
                  fontWeight="600"
                  dy="0.35em"
                >
                  {p.name.slice(0, 4)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 详情面板 */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-xl border border-noir-700/50 bg-noir-800/30 max-w-lg mx-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-serif font-semibold text-amber-light">{active.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full border border-amber/30 text-amber/70">{active.layer}</span>
            </div>
            <p className="text-sm text-noir-300 leading-relaxed mb-3">{active.core}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-noir-500">关联原则：</span>
              {active.connections.map((conn) => {
                const connP = principles.find((pp) => pp.id === conn);
                return connP ? (
                  <span key={conn} className="text-xs px-2 py-0.5 rounded-full bg-noir-700/50 text-noir-300">
                    {connP.name}
                  </span>
                ) : null;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}