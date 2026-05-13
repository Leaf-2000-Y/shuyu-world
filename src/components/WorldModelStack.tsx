import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, GitBranch, Layers } from 'lucide-react';

interface LayerData {
  level: number;
  title: string;
  subtitle: string;
  concepts: string[];
  color: string;
  borderColor: string;
  glowColor: string;
  metrics: { label: string; value: string }[];
}

const layers: LayerData[] = [
  {
    level: 4,
    title: '叙事行动层',
    subtitle: 'Narrative Action',
    concepts: ['叙事权争夺', '框架设定', '使命召唤', '制造不确定性', '内外视角辩证'],
    color: 'from-amber/80 to-amber-light',
    borderColor: 'border-amber',
    glowColor: 'rgba(200,164,78,0.15)',
    metrics: [
      { label: '叙事杠杆', value: '专长 × 媒介 × 受众' },
      { label: '框架效力', value: '改变参照点的强度' },
    ],
  },
  {
    level: 3,
    title: '决策赋能层',
    subtitle: 'Decision & Empowerment',
    concepts: ['概率分布决策', '不对称性', '期权思维', '结构洞', '凯利公式'],
    color: 'from-amber/50 to-amber/70',
    borderColor: 'border-amber/60',
    glowColor: 'rgba(200,164,78,0.1)',
    metrics: [
      { label: '期望价值', value: 'P(win)×Gain - P(loss)×Loss' },
      { label: '期权密度', value: '可进入路径 / 总路径' },
    ],
  },
  {
    level: 2,
    title: '认知操作系统层',
    subtitle: 'Cognitive OS',
    concepts: ['参照点管理', '偏误识别', '外部视角', '回归均值', '选择偏差'],
    color: 'from-amber/30 to-amber/50',
    borderColor: 'border-amber/40',
    glowColor: 'rgba(200,164,78,0.06)',
    metrics: [
      { label: '认知校准度', value: '预测与实际的相关系数' },
      { label: '反馈接收率', value: '收到的真实反馈数' },
    ],
  },
  {
    level: 1,
    title: '世界真相层',
    subtitle: 'Ground Truth',
    concepts: ['五种不确定性', '四大硬约束', '重尾分布', '叙事场', '回归均值'],
    color: 'from-amber/10 to-amber/30',
    borderColor: 'border-amber/20',
    glowColor: 'rgba(200,164,78,0.03)',
    metrics: [
      { label: '不确定性指数', value: '∑(五类不确定性的暴露程度)' },
      { label: '硬约束密度', value: '有效行动空间 / 想象空间' },
    ],
  },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export default function WorldModelStack() {
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dataFlow, setDataFlow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setDataFlow((p) => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  const initParticles = useCallback(() => {
    const pts: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      pts.push({
        id: i,
        x: 10 + Math.random() * 80,
        y: 5 + Math.random() * 90,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.4,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
    return pts;
  }, []);

  useEffect(() => {
    setParticles(initParticles());
  }, [initParticles]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-noir-400 text-sm">点击层级查看核心概念、度量指标和跨层数据流</p>
        <div className="flex items-center gap-2 text-[10px] text-noir-500">
          <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
          数据流活跃
        </div>
      </div>

      {/* 层级之间的动态粒子连线区域 */}
      <div className="relative">
        {layers.map((layer, idx) => {
          const isExpanded = expandedLayer === layer.level;
          const isNextExpanded = expandedLayer === layer.level + 1;
          const isPrevExpanded = expandedLayer === layer.level - 1;
          const showFlow = isExpanded || (expandedLayer !== null && (isNextExpanded || isPrevExpanded));

          return (
            <motion.div
              key={layer.level}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="relative"
            >
              {/* 层间数据流粒子桥 */}
              {showFlow && idx < layers.length - 1 && (
                <div className="absolute -bottom-2 left-[10%] right-[10%] h-8 overflow-hidden z-20">
                  {particles.slice(0, 8).map((p, pi) => (
                    <motion.div
                      key={p.id}
                      className="absolute rounded-full"
                      style={{
                        width: p.size,
                        height: p.size,
                        background: `rgba(200,164,78,${p.opacity})`,
                      }}
                      animate={{
                        y: [0, 28, 0],
                        x: [p.x * 2, p.x * 2 + 20 - Math.random() * 40, p.x * 2],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        duration: 2 + p.speed,
                        repeat: Infinity,
                        delay: pi * 0.3,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={() => setExpandedLayer(isExpanded ? null : layer.level)}
                className={`w-full text-left p-5 rounded-xl border ${layer.borderColor} bg-noir-800/50 hover:bg-noir-800/70 transition-all duration-300 group relative overflow-hidden`}
              >
                {/* 动态发光背景 */}
                {isExpanded && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ background: `radial-gradient(circle at ${30 + dataFlow}% 50%, ${layer.glowColor}, transparent 70%)` }}
                  />
                )}

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className={`text-2xl font-bold bg-gradient-to-br ${layer.color} bg-clip-text text-transparent`}>
                        L{layer.level}
                      </span>
                      {isExpanded && (
                        <motion.div
                          className="absolute -inset-1 rounded-full"
                          style={{ border: `1px solid ${layer.glowColor}` }}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-noir-100 group-hover:text-noir-50 transition-colors">
                        {layer.title}
                      </h3>
                      <p className="text-xs text-noir-500 tracking-wider">{layer.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-noir-500">{layer.concepts.length} 个核心概念</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="text-noir-500" size={18} />
                    </motion.div>
                  </div>
                </div>

                {/* 展开的内容区域 */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="mt-5 pt-5 border-t border-noir-700/50 space-y-4">
                        {/* 概念标签云 */}
                        <div>
                          <p className="text-[10px] text-noir-500 mb-2 flex items-center gap-1">
                            <GitBranch size={10} /> 核心概念
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {layer.concepts.map((concept, ci) => (
                              <motion.span
                                key={concept}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: ci * 0.08 }}
                                className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${layer.color} bg-clip-border text-noir-100 border ${layer.borderColor} cursor-default`}
                                whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
                              >
                                {concept}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* 度量指标 */}
                        <div>
                          <p className="text-[10px] text-noir-500 mb-2 flex items-center gap-1">
                            <Zap size={10} /> 关键度量
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {layer.metrics.map((metric, mi) => (
                              <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + mi * 0.1 }}
                                className="p-2 rounded-lg bg-noir-800/70 border border-noir-700/30"
                              >
                                <p className="text-[10px] text-noir-500">{metric.label}</p>
                                <p className="text-[11px] text-amber-light font-mono mt-0.5">{metric.value}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* 模型数据面板 */}
      <div className="mt-8 p-6 rounded-xl border border-noir-700/50 bg-noir-800/30">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={14} className="text-amber" />
          <h4 className="text-sm font-semibold text-amber-light">模型核心命题</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            '世界是叙事场而非事实堆——叙事决定目标函数',
            '不确定性是意义的燃料——抗拒→接受→拥抱→制造',
            '决策管理概率分布——不计单次结果，追求过程正义',
            '能耐 > 目标——君子不器，增加选项优先于优化单一目标',
            '认知偏误是默认设置——需要外部视角和参考类预测校准',
            '结构决定行为——设计环境让正确的行动成为最小阻力',
          ].map((prop, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-xs text-noir-300"
            >
              <span className="text-amber mt-0.5 shrink-0">•</span>
              <span>{prop}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}