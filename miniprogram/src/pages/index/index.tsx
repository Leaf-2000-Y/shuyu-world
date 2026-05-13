import { useState, useEffect, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.css';

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
  { num: '第〇章', title: '理论基石', sub: '世界理解模型的底层公理', id: 'ch0' },
  { num: '第一章', title: '世界的真相', sub: '不确定性、硬约束与叙事场', id: 'ch1' },
  { num: '第二章', title: '认知的枷锁', sub: '我们如何误解世界', id: 'ch2' },
  { num: '第三章', title: '决策的艺术', sub: '从概率分布到不对称性', id: 'ch3' },
  { num: '第四章', title: '赋能之路', sub: '君子不器与能耐寻求', id: 'ch4' },
  { num: '第五章', title: '叙事行动', sub: '成为意义的创造者', id: 'ch5' },
  { num: '第六章', title: '实践应用', sub: '理论到行动的完整闭环', id: 'ch6' },
  { num: '第七章', title: '系统整合', sub: '五层模型的协同运作', id: 'ch7' },
];

const idMap: Record<string, string> = {
  'ch0': 'intro',
  'ch1': 'ch1',
  'ch2': 'ch2',
  'ch3': 'ch3',
  'ch4': 'ch4',
  'ch5': 'ch5',
  'ch6': 'ch6',
  'ch7': 'ch7',
};

export default function Index() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goArticle = useCallback(() => {
    Taro.navigateTo({ url: '/pages/article/article' });
  }, []);

  const goInteractive = useCallback(() => {
    Taro.navigateTo({ url: '/pages/interactive/interactive' });
  }, []);

  const goChapter = useCallback((chId: string) => {
    const articleId = idMap[chId] || chId;
    Taro.setStorageSync('targetChapter', articleId);
    Taro.navigateTo({ url: '/pages/article/article' });
  }, []);

  return (
    <View className="landing-page">
      {/* 背景 */}
      <View className="landing-bg" />

      {/* 主内容 */}
      <View className="landing-content">
        {show && (
          <View className="hero-section fade-in-up">
            {/* 品牌标题 */}
            <Text className="hero-title">树语世界</Text>
            <Text className="hero-subtitle">叙事场与赋能者</Text>

            {/* 核心金句 */}
            <View className="quote-section">
              <Text className="quote-text">「{quotes[quoteIndex]}」</Text>
            </View>

            {/* 行动按钮 */}
            <View className="cta-section">
              <View className="btn-primary" onClick={goArticle}>
                <Text>阅读全文</Text>
              </View>
              <View className="btn-secondary" onClick={goInteractive}>
                <Text>交互概念图</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 章节目录 */}
      <View className="chapters-section">
        <Text className="chapters-title">章节目录</Text>
        <View className="chapters-grid">
          {chapters.map((ch, i) => (
            <View
              key={ch.id}
              className={`chapter-card ${show ? 'fade-in-up' : ''}`}
              style={{ animationDelay: `${2.5 + i * 0.1}s` }}
              onClick={() => goChapter(ch.id)}
            >
              <Text className="chapter-num">{ch.num}</Text>
              <Text className="chapter-title">{ch.title}</Text>
              <Text className="chapter-sub">{ch.sub}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 底部链接 */}
      <View className="landing-links">
        <View className="link-item" onClick={() => Taro.navigateTo({ url: '/pages/principles/principles' })}>
          <Text className="link-text">原则体系</Text>
        </View>
        <View className="link-item" onClick={() => Taro.navigateTo({ url: '/pages/interactive/interactive' })}>
          <Text className="link-text">概念图谱</Text>
        </View>
      </View>

      {/* 底部 */}
      <View className="landing-footer">
        <Text className="footer-text">© 2026 树语世界 · 不确定性是意义的燃料</Text>
      </View>
    </View>
  );
}