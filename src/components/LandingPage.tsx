import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'article' | 'interactive') => void;
}

const quotes = [
  '世界不是事实堆，而是叙事场',
  '不确定性是意义的燃料',
  '抗拒不确定性不如接受，接受不如拥抱，拥抱不如制造',
  '决策选的不是结果，而是概率分布',
  '君子不器：增加选项优先于优化单一目标',
  '善战者无赫赫之功',
  '你决定的是放弃哪些东西',
];

const chapters = [
  { num: '第一章', title: '世界的真相', sub: '不确定性、硬约束与叙事场' },
  { num: '第二章', title: '认知的枷锁', sub: '我们如何误解世界' },
  { num: '第三章', title: '决策的艺术', sub: '从概率分布到不对称性' },
  { num: '第四章', title: '赋能之路', sub: '君子不器与能耐寻求' },
  { num: '第五章', title: '叙事行动', sub: '成为意义的创造者' },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-screen w-full relative overflow-hidden font-serif"
      style={{ perspective: '1000px', background: '#f5f0e8', color: '#2a2020' }}
    >
      {/* 背景渐变 + 宣纸纹理 */}
      <div className="absolute inset-0 z-[1]">
        <div
          className="absolute inset-0 transition-opacity duration-[3000ms]"
          style={{
            opacity: showContent ? 1 : 0,
            background: 'radial-gradient(circle at center, #ffffff 0%, #f0ebe0 45%, #e8e0d0 85%)',
          }}
        />
        {/* 宣纸噪点纹理——更淡雅 */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }}>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noiseInk">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseInk)" opacity="1" />
          </svg>
        </div>
      </div>

      {/* 墨韵光晕 */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none z-[2]"
        style={{ background: 'rgba(80,50,30,0.03)' }}
      />

      {/* 主内容 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="text-center max-w-3xl"
            >
              {/* 品牌标题 */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.5, ease: 'easeOut' }}
                className="text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-[0.15em] mb-4"
                style={{
                  color: '#2a2020',
                  textShadow: '0 0 60px rgba(80,50,30,0.08)',
                }}
              >
                树语世界
              </motion.h1>

              {/* 副标题 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 2 }}
                className="text-sm md:text-base tracking-[0.3em] mb-12"
                style={{ color: '#9a8a7a' }}
              >
                叙事场与赋能者
              </motion.p>

              {/* 核心金句轮播 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 2 }}
                className="mb-16 h-20"
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 1.5 }}
                    className="text-lg md:text-xl italic leading-relaxed"
                    style={{ color: '#4a3838' }}
                  >
                    「{quotes[quoteIndex]}」
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* 行动按钮 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
              >
                <button
                  onClick={() => onNavigate('article')}
                  className="px-8 py-3 rounded-full text-sm tracking-wider transition-all duration-500"
                  style={{
                    border: '1px solid rgba(139,69,19,0.4)',
                    color: '#8b4513',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'rgba(139,69,19,0.06)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; }}
                >
                  阅读全文 →
                </button>
                <button
                  onClick={() => onNavigate('interactive')}
                  className="px-8 py-3 rounded-full text-sm tracking-wider transition-all duration-500"
                  style={{
                    border: '1px solid rgba(154,138,122,0.4)',
                    color: '#9a8a7a',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'rgba(154,138,122,0.05)'; (e.target as HTMLElement).style.borderColor = 'rgba(100,70,40,0.5)'; (e.target as HTMLElement).style.color = '#6b4630'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.borderColor = 'rgba(154,138,122,0.4)'; (e.target as HTMLElement).style.color = '#9a8a7a'; }}
                >
                  交互概念图
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 章节目录导航 */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-5xl mx-auto px-6 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {chapters.map((ch, i) => (
              <motion.button
                key={ch.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 + i * 0.15, duration: 1 }}
                onClick={() => onNavigate('article')}
                className="text-left p-3 rounded-lg transition-all duration-500 group"
                style={{
                  border: '1px solid rgba(180,160,140,0.3)',
                  background: 'rgba(255,252,248,0.4)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(139,69,19,0.25)';
                  (e.target as HTMLElement).style.background = 'rgba(255,250,245,0.7)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(180,160,140,0.3)';
                  (e.target as HTMLElement).style.background = 'rgba(255,252,248,0.4)';
                }}
              >
                <span className="text-xs tracking-wider" style={{ color: '#8b4513' }}>
                  {ch.num}
                </span>
                <h4
                  className="text-sm mt-1 font-medium transition-colors group-hover:text-[#3a2820]"
                  style={{ color: '#5a4840' }}
                >
                  {ch.title}
                </h4>
                <p
                  className="text-xs mt-0.5 transition-colors"
                  style={{ color: '#b0a090' }}
                >
                  {ch.sub}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 向下滚动指示器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1.5 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={20} style={{ color: '#c0b0a0' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}