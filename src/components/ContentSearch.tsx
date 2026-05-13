import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface Concept {
  id: string;
  term: string;
  category: string;
  layer: string;
  description: string;
  related: string[];
  tags: string[];
}

const concepts: Concept[] = [
  { id: 'c1', term: '滞后效应', category: '复杂系统', layer: 'Layer 1', description: '行动与结果之间存在时间差。决策的恶果不会立刻显现，红利也不会即时兑现。理解滞后效应意味着你需要在判断中纳入时间维度。', related: ['反馈回路', '临界点', '回归均值'], tags: ['系统', '时间', '因果'] },
  { id: 'c2', term: '反馈回路', category: '复杂系统', layer: 'Layer 1', description: '正反馈自我强化（富者愈富），负反馈自我调节（恒温器原理）。识别系统的反馈回路是顺势而为的前提。', related: ['滞后效应', '临界点', '反身性'], tags: ['系统', '动力学', '循环'] },
  { id: 'c3', term: '临界点', category: '复杂系统', layer: 'Layer 1', description: '系统变化的非线性阈值。临界点之前看似稳定，一旦越过则指数级变化。解释了黑天鹅事件的突发性和重尾分布的形成机制。', related: ['滞后效应', '幂律分布', '重尾分布'], tags: ['突变', '非线性', '阈值'] },
  { id: 'c4', term: '期望价值公式', category: '决策科学', layer: 'Layer 3', description: '期望价值 = 结果收益 × 发生概率 - 结果损失 × 发生概率。量化不确定性的核心工具，将直觉决策转化为数学决策。', related: ['概率分布', '凯利公式', '损失上限'], tags: ['计算', '概率', '量化'] },
  { id: 'c5', term: '可信度加权', category: '决策科学', layer: 'Layer 2', description: '观点权重与发言者可信度成正比。可信者需满足两个条件：在相关领域有3次以上可验证成功经验，且能清晰解释因果逻辑。', related: ['外部视角', '参考类预测', '认知闭环'], tags: ['判断', '信任', '决策'] },
  { id: 'c6', term: '杠铃策略', category: '反脆弱', layer: 'Layer 3', description: '将资源配置分为两极：一端极度保守（90%安全资产），一端极度冒险（10%高风险高回报），避免中庸。既保护了下行风险，又保留了上行空间。', related: ['反脆弱', '期权思维', '损失厌恶'], tags: ['策略', '风险', '配置'] },
  { id: 'c7', term: '环境预置法', category: '行为设计', layer: 'Layer 4', description: '不依赖意志力，而是重新设计环境结构，让正确行动成为阻力最小的选择。能量永远沿最小阻力路径流动。', related: ['结构决定行为', '习惯养成', '系统设计'], tags: ['设计', '自动化', '环境'] },
  { id: 'c8', term: '联机学习', category: '学习方法', layer: 'Layer 4', description: '先输出自己的答案→用答案换答案→快速迭代认知→形成体系。用群体智慧替代个人孤独积累，打破认知闭环。', related: ['结构洞', '社交网络', '知识交换'], tags: ['学习', '社交', '迭代'] },
  { id: 'c9', term: '自由公式', category: '人生策略', layer: 'Layer 4', description: '财富 = 专长 × 杠杆 × 判断力。专长是无法被培训的独特组合，杠杆是放大努力的乘数，判断力是在不确定中做高胜率决策的能力。', related: ['复利', '能耐寻求', '君子不器'], tags: ['公式', '财富', '自由'] },
  { id: 'c10', term: '主要矛盾', category: '辩证思维', layer: 'Layer 1', description: '在事物发展的众多矛盾中，必然有一个是主要的、起决定性作用的。识别主要矛盾是确定行动优先级的前提。', related: ['矛盾特殊性', '实事求是', '叙事场'], tags: ['辩证', '优先级', '判断'] },
  { id: 'c11', term: '痛苦+反思=进步', category: '认知成长', layer: 'Layer 2', description: '痛苦不是需要回避的感受，而是需要解读的信号。每一次痛苦都在告诉你：认知模型与现实之间存在差距。迎接痛苦，深度反思。', related: ['激进事实', '认知偏误', '成长型心智'], tags: ['成长', '情绪', '反思'] },
  { id: 'c12', term: '复利曲线', category: '人生策略', layer: 'Layer 4', description: '一切有价值的事物都遵循复利曲线：前期平缓，越过拐点后指数级爆发。绝大多数人死于拐点到来之前的放弃。三要素：长期持续、稳定成长率、足够时间。', related: ['系统思维', '长期主义', '能耐寻求'], tags: ['数学', '长期', '积累'] },
];

const categories = [...new Set(concepts.map((c) => c.category))];
const layers = [...new Set(concepts.map((c) => c.layer))];
const allTags = [...new Set(concepts.flatMap((c) => c.tags))];

export default function ContentSearch() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const results = useMemo(() => {
    return concepts.filter((c) => {
      if (query && !c.term.includes(query) && !c.description.includes(query) && !c.tags.some((t) => t.includes(query))) return false;
      if (selectedCategory && c.category !== selectedCategory) return false;
      if (selectedLayer && c.layer !== selectedLayer) return false;
      if (selectedTag && !c.tags.includes(selectedTag)) return false;
      return true;
    });
  }, [query, selectedCategory, selectedLayer, selectedTag]);

  const selected = concepts.find((c) => c.id === selectedId);

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-noir-500" />
        <input
          type="text"
          placeholder="搜索概念、关键词或描述..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-noir-800 border border-noir-700 text-noir-200 text-sm placeholder-noir-500 focus:outline-none focus:border-amber/50 transition-colors"
        />
      </div>

      {/* 过滤标签 */}
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 rounded-full bg-noir-800 border border-noir-700 text-xs text-noir-300 focus:outline-none focus:border-amber/50"
        >
          <option value="">全部类别</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
          className="px-3 py-1.5 rounded-full bg-noir-800 border border-noir-700 text-xs text-noir-300 focus:outline-none focus:border-amber/50"
        >
          <option value="">全部层级</option>
          {layers.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-1.5 rounded-full bg-noir-800 border border-noir-700 text-xs text-noir-300 focus:outline-none focus:border-amber/50"
        >
          <option value="">全部标签</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={() => { setQuery(''); setSelectedCategory(''); setSelectedLayer(''); setSelectedTag(''); }}
          className="px-3 py-1.5 rounded-full text-xs text-noir-400 hover:text-noir-200 transition-colors"
        >
          清除筛选
        </button>
      </div>

      {/* 结果列表 */}
      <div className="space-y-2">
        {results.length === 0 && (
          <p className="text-center text-noir-500 text-sm py-8">未找到匹配的概念</p>
        )}
        {results.map((c) => (
          <motion.button
            key={c.id}
            layout
            onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
              selectedId === c.id
                ? 'border-amber/50 bg-amber/5'
                : 'border-noir-800 hover:border-noir-700 bg-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-noir-100">{c.term}</span>
                <span className="ml-2 text-[10px] text-noir-500">{c.category}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-noir-700/50 text-noir-400">{c.layer}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {c.tags.map((t) => (
                <span key={t} className="text-[10px] text-noir-500">#{t}</span>
              ))}
            </div>
            <AnimatePresence>
              {selectedId === c.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-noir-700/50">
                    <p className="text-xs text-noir-300 leading-relaxed">{c.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-[10px] text-noir-500">关联：</span>
                      {c.related.map((r) => (
                        <button
                          key={r}
                          onClick={(e) => { e.stopPropagation(); setQuery(r); }}
                          className="text-[10px] text-amber/70 hover:text-amber underline"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-[10px] text-noir-500">
        共 {concepts.length} 个概念 · 显示 {results.length} 个
      </p>
    </div>
  );
}