import { useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import ReadingProgress from './ReadingProgress';
import SideNav from './SideNav';
import StickyNav from './StickyNav';
import BackToTop from './BackToTop';
import ConceptCard from './ConceptCard';
import QuoteHighlight from './QuoteHighlight';

import articleRaw from '../data/article.md?raw';

const chapterThemes: Record<string, string> = {
  '引言': 'from-noir-900 via-noir-900 to-noir-800',
  '第一章': 'from-noir-900 via-noir-800/80 to-noir-900',
  '第二章': 'from-noir-900 via-noir-800/60 to-noir-900',
  '第三章': 'from-noir-900 via-noir-800/80 to-noir-900',
  '第四章': 'from-noir-900 via-noir-800/60 to-noir-900',
  '第五章': 'from-noir-900 via-noir-800/80 to-noir-900',
  '结语': 'from-noir-900 via-noir-800/40 to-noir-900',
};

function wrapChapterContent(markdown: string): { id: string; title: string; content: string }[] {
  const lines = markdown.split('\n');
  const sections: { id: string; title: string; content: string }[] = [];
  let currentTitle = '';
  let currentContent: string[] = [];
  let currentId = '';

  const idMap: Record<string, string> = {
    '引言': 'intro',
    '第一章': 'ch1',
    '第二章': 'ch2',
    '第三章': 'ch3',
    '第四章': 'ch4',
    '第五章': 'ch5',
    '结语': 'conclusion',
  };

  for (const line of lines) {
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      if (currentTitle && currentContent.length > 0) {
        sections.push({
          id: currentId || currentTitle,
          title: currentTitle,
          content: currentContent.join('\n').trim(),
        });
      }
      currentTitle = line.replace('## ', '').trim();
      for (const [key, id] of Object.entries(idMap)) {
        if (currentTitle.includes(key)) {
          currentId = id;
          break;
        }
      }
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentTitle && currentContent.length > 0) {
    sections.push({
      id: currentId || currentTitle,
      title: currentTitle,
      content: currentContent.join('\n').trim(),
    });
  }

  return sections;
}

function getSectionBg(title: string): string {
  if (title.includes('引言') || title.includes('第一章')) return 'radial-bg';
  if (title.includes('结语')) return 'from-noir-900 to-noir-800';
  return 'bg-noir-900';
}

export default function ArticlePage() {
  const sections = useMemo(() => wrapChapterContent(articleRaw), []);
  const pageRef = useRef<HTMLDivElement>(null);

  // 处理从 LandingPage 带锚点的跳转
  useEffect(() => {
    // 检查 URL hash 或 sessionStorage 中的目标章节
    const targetChapter = sessionStorage.getItem('targetChapter');
    if (targetChapter) {
      // 清除存储
      sessionStorage.removeItem('targetChapter');
      
      // 等待 DOM 渲染完成后滚动到目标章节
      setTimeout(() => {
        const el = document.getElementById(targetChapter);
        if (el) {
          // 考虑导航栏高度偏移
          const navHeight = 80; // StickyNav 高度
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
    }

    // 监听自定义事件
    const handleScrollToChapter = ((e: CustomEvent) => {
      const chapterId = e.detail;
      setTimeout(() => {
        const el = document.getElementById(chapterId);
        if (el) {
          const navHeight = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }) as EventListener;

    window.addEventListener('scrollToChapter', handleScrollToChapter);
    return () => window.removeEventListener('scrollToChapter', handleScrollToChapter);
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-noir-900 font-serif">
      <ReadingProgress />
      <StickyNav sections={sections} />
      <SideNav />
      <BackToTop />

      {sections.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          className={`relative min-h-screen py-24 px-6 ${getSectionBg(section.title)}`}
        >
          {/* 章节环境光晕 */}
          {idx === 0 && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-amber/3 blur-[150px] pointer-events-none" />
          )}

          <div className="max-w-3xl mx-auto relative z-10">
            {/* 章节标题 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-noir-700" />
                <span className="text-xs tracking-[0.3em] text-amber/60 uppercase">
                  {idx === 0 ? 'PROLOGUE' : idx === sections.length - 1 ? 'EPILOGUE' : `CHAPTER ${idx}`}
                </span>
                <div className="h-px flex-1 bg-noir-700" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-light text-center glow-text">
                {section.title}
              </h2>
            </motion.div>

            {/* 章节内容 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="article-content"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  blockquote({ children }) {
                    const text = extractText(children);
                    return <QuoteHighlight>{text}</QuoteHighlight>;
                  },
                  h3({ children }) {
                    const text = extractText(children);
                    if (text.includes('概念卡片')) return null;
                    return <h3>{children}</h3>;
                  },
                  p({ children }) {
                    const text = extractText(children);
                    if (text.startsWith('@concept:')) {
                      const parts = text.replace('@concept:', '').split('|');
                      const title = parts[0]?.trim() || '';
                      const scholar = parts[1]?.trim() || undefined;
                      const desc = parts[2]?.trim() || '';
                      return (
                        <ConceptCard title={title} scholar={scholar}>
                          {desc}
                        </ConceptCard>
                      );
                    }
                    return <p>{children}</p>;
                  },
                }}
              >
                {section.content}
              </ReactMarkdown>
            </motion.div>
          </div>
        </section>
      ))}

      {/* 底部引用来源 */}
      <section className="py-16 px-6 bg-noir-900 border-t border-noir-800">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-sm font-semibold text-amber-light mb-6 tracking-wider">理论来源</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-noir-400 leading-relaxed">
              <div>
                <p className="text-noir-300 font-medium mb-2">决策科学与行为经济学</p>
                <p>Kahneman & Tversky — 前景理论、回归谬误、规划谬误</p>
                <p>Thaler — 心理账户、禀赋效应</p>
              </div>
              <div>
                <p className="text-noir-300 font-medium mb-2">复杂系统与不确定性</p>
                <p>Wolfram — 计算不可约性</p>
                <p>Knight — 奈特不确定性</p>
                <p>Soros — 反身性理论</p>
                <p>Taleb — 反脆弱、重尾分布</p>
              </div>
              <div>
                <p className="text-noir-300 font-medium mb-2">系统思维与赋能</p>
                <p>Scott Adams — 系统 vs 目标</p>
                <p>信息论 — 赋能概念</p>
                <p>Mullainathan & Shafir — 稀缺与隧道效应</p>
              </div>
              <div>
                <p className="text-noir-300 font-medium mb-2">社会网络与权力</p>
                <p>Ronald Burt — 结构洞理论</p>
                <p>Raj Chetty — 社会流动性与经济连通性</p>
                <p>Robert Greene — 权力的48条法则</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map((c) => {
      if (typeof c === 'string') return c;
      if (c && typeof c === 'object' && 'props' in c) {
        return extractText((c as { props: { children?: React.ReactNode } }).props.children);
      }
      return '';
    }).join('');
  }
  return '';
}