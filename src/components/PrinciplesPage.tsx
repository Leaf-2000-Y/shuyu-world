import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TheoryComparison from './TheoryComparison';
import MultiOrderThinking from './MultiOrderThinking';
import PrincipleNetwork from './PrincipleNetwork';
import ContentSearch from './ContentSearch';

type Tab = 'network' | 'compare' | 'think' | 'search';

export default function PrinciplesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('network');

  const tabs: { id: Tab; label: string; desc: string }[] = [
    { id: 'network', label: '原则关系图谱', desc: '十二大原则的关联网络' },
    { id: 'compare', label: '理论对比分析', desc: '多框架核心命题对比' },
    { id: 'think', label: '多阶思维推演', desc: '动态观点演绎系统' },
    { id: 'search', label: '内容检索', desc: '多维度概念搜索' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-noir-900 font-serif">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-light glow-text mb-3">
            原则体系
          </h1>
          <p className="text-noir-400 text-sm">十二大原则框架 · 深化世界理解模型</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-xs tracking-wide transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-amber/10 border border-amber/50 text-amber'
                  : 'border border-noir-700 text-noir-400 hover:text-noir-200 hover:border-noir-500'
              }`}
            >
              {tab.label}
              <span className="block text-[10px] opacity-50 mt-0.5">{tab.desc}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'network' && <PrincipleNetwork />}
            {activeTab === 'compare' && <TheoryComparison />}
            {activeTab === 'think' && <MultiOrderThinking />}
            {activeTab === 'search' && <ContentSearch />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}