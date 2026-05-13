import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorldModelStack from './WorldModelStack';
import ProspectCurve from './ProspectCurve';
import UncertaintyViz from './UncertaintyViz';
import DecisionSimulator from './DecisionSimulator';

type Tab = 'model' | 'curve' | 'uncertainty' | 'simulator';

export default function InteractivePage() {
  const [activeTab, setActiveTab] = useState<Tab>('model');

  const tabs: { id: Tab; label: string; desc: string }[] = [
    { id: 'model', label: '四层世界模型', desc: '动态数据流 + 粒子连接' },
    { id: 'curve', label: '前景理论曲线', desc: '数据点交互 + 历史对比' },
    { id: 'uncertainty', label: '不确定性分类', desc: '脉冲连线 + 联动模式' },
    { id: 'simulator', label: '决策模拟器', desc: '期望价值计算 + 风险评估' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-noir-900 font-serif">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-light glow-text mb-4">
            交互概念图
          </h1>
          <p className="text-noir-400 text-sm">
            探索「叙事—赋能」世界理解模型的核心概念
          </p>
        </motion.div>

        {/* 选项卡切换 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm tracking-wide transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-amber/10 border border-amber/50 text-amber'
                  : 'border border-noir-700 text-noir-400 hover:text-noir-200 hover:border-noir-500'
              }`}
            >
              {tab.label}
              <span className="block text-xs opacity-50 mt-0.5">{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'model' && <WorldModelStack />}
            {activeTab === 'curve' && <ProspectCurve />}
            {activeTab === 'uncertainty' && <UncertaintyViz />}
            {activeTab === 'simulator' && <DecisionSimulator />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}