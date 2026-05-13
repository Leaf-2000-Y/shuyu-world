import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scenarios = [
  {
    question: '你想要开发一个AI产品并上线',
    options: ['花3个月打磨到完美再发布', '两周内做出MVP快速上线获取反馈', '先研究竞品一年再做决策'],
    correct: 1,
    analysis: {
      order1: '快速获得用户反馈，验证市场需求',
      order2: '反馈驱动迭代，产品更快找到PMF——但初版可能质量粗糙，伤害早期用户信任',
      order3: '建立快速迭代的团队文化和用户社区，积累品牌认知，形成先发优势——前提是核心功能确实能解决问题',
    },
  },
  {
    question: '你收到一份高薪但996的工作offer',
    options: ['接受，高薪能快速积累财富', '拒绝，选择时间自由但收入较低的工作', '接受，但设定1年期限后评估'],
    correct: 2,
    analysis: {
      order1: '获得高收入和行业经验',
      order2: '高强度工作压缩学习创作时间，人际关系和健康受损——但1年期限让你有退出通道',
      order3: '积累的行业认知和人脉可转化为未来创业资源，且有明确的退出机制避免陷入温水煮青蛙',
    },
  },
  {
    question: '你发现一个热门技术趋势，很多人都在追',
    options: ['立刻投入学习，不能被落下', '冷静分析该趋势与自己能力圈的关系', '无视它，专注自己已有的方向'],
    correct: 1,
    analysis: {
      order1: '快速获取信息，判断是否在自己的能力圈延伸线上',
      order2: '如果相关则低门槛试水（如做个demo），如果不相关则保持关注但不投入——避免FOMO驱动的资源浪费',
      order3: '建立系统化的趋势监测机制，让趋势判断从一次性决策变成持续性能力，同时保护核心方向的深度积累',
    },
  },
];

export default function MultiOrderThinking() {
  const [step, setStep] = useState(0);

  const current = scenarios[step];
  const isDone = step >= scenarios.length;

  return (
    <div className="space-y-8">
      <p className="text-center text-noir-400 text-sm">
        每一步做出选择，观察一阶、二阶、三阶后果的逐层展开
      </p>

      {isDone ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8"
        >
          <h3 className="text-xl font-serif font-semibold text-amber-light mb-3">推演完成</h3>
          <p className="text-sm text-noir-400 mb-4">
            你完成了三个场景的多阶思维训练。核心洞见：
          </p>
          <p className="text-xs text-noir-300 italic">
            「顶级决策往往是牺牲一阶好处换取三阶红利。永远不要因为一阶的困难，放弃二阶三阶的巨大红利。」
          </p>
          <button
            onClick={() => setStep(0)}
            className="mt-6 px-5 py-2 rounded-full border border-amber/50 text-amber text-xs hover:bg-amber/10 transition-colors"
          >
            重新开始
          </button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl border border-noir-700/50 bg-noir-800/30">
              <p className="text-sm font-medium text-noir-200 mb-4">
                场景 {step + 1}/{scenarios.length}：{current.question}
              </p>

              <div className="space-y-3">
                {current.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const btn = document.getElementById(`opt-${step}-${i}`);
                      if (btn) {
                        btn.dataset.selected = 'true';
                      }
                    }}
                    id={`opt-${step}-${i}`}
                    className="w-full text-left p-3 rounded-lg border border-noir-700 hover:border-amber/40 transition-all text-xs text-noir-300 hover:text-noir-100"
                    onMouseDown={(e) => {
                      const el = e.currentTarget;
                      setTimeout(() => {
                        if (el.dataset.selected === 'true') {
                          el.style.borderColor = i === current.correct ? 'rgba(200,164,78,0.6)' : 'rgba(180,80,80,0.6)';
                          el.style.background = i === current.correct ? 'rgba(200,164,78,0.08)' : 'rgba(180,80,80,0.08)';
                        }
                      }, 100);
                    }}
                  >
                    {['A', 'B', 'C'][i]}. {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 多阶分析展开 */}
            <div className="space-y-3">
              {(['order1', 'order2', 'order3'] as const).map((orderKey, idx) => (
                <motion.div
                  key={orderKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.3 }}
                  className="p-3 rounded-lg border border-noir-700/30 bg-noir-800/20"
                >
                  <span className="text-[10px] text-amber/60 tracking-wider uppercase">
                    {idx === 0 ? '一阶后果（即时）' : idx === 1 ? '二阶后果（滞后）' : '三阶后果（系统性）'}
                  </span>
                  <p className="text-xs text-noir-300 mt-1">{current.analysis[orderKey]}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2 rounded-full border border-amber/50 text-amber text-xs hover:bg-amber/10 transition-colors"
              >
                下一个场景 →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}