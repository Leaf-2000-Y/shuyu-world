import { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePageScroll } from '@tarojs/taro';
import articleRaw from '../../data/article.md';
import './article.css';

const chapterIds: Record<string, string> = {
  '理论基石': 'ch0',
  '世界的真相': 'ch1',
  '认知的枷锁': 'ch2',
  '决策的艺术': 'ch3',
  '赋能之路': 'ch4',
  '叙事行动': 'ch5',
  '实践应用': 'ch6',
  '系统整合': 'ch7',
};

interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string; parts: InlinePart[] }
  | { type: 'blockquote'; text: string }
  | { type: 'hr' }
  | { type: 'code'; text: string }
  | { type: 'divider' };

interface InlinePart {
  text: string;
  bold: boolean;
}

function parseMarkdown(md: string): Section[] {
  const lines = md.split('\n');
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let inCodeBlock = false;
  let codeLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        if (currentSection && codeLines.length > 0) {
          currentSection.blocks.push({ type: 'code', text: codeLines.join('\n') });
          codeLines = [];
        }
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith('## ') && !line.startsWith('### ')) {
      const title = line.replace('## ', '').trim();
      let id = '';
      for (const [key, val] of Object.entries(chapterIds)) {
        if (title.includes(key)) { id = val; break; }
      }
      if (!id) {
        if (title.includes('引言')) id = 'intro';
        else if (title.includes('结语')) id = 'conclusion';
        else id = title;
      }
      currentSection = { id, title, blocks: [] };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) continue;

    if (line.startsWith('### ')) {
      currentSection.blocks.push({ type: 'heading', level: 3, text: line.replace('### ', '').trim() });
      continue;
    }

    if (line.trim() === '---') {
      currentSection.blocks.push({ type: 'hr' });
      continue;
    }

    if (line.startsWith('> ')) {
      currentSection.blocks.push({ type: 'blockquote', text: line.replace('> ', '').trim() });
      continue;
    }

    if (line.trim() === '') continue;

    const parts = parseInline(line);
    if (parts.length > 0) {
      currentSection.blocks.push({ type: 'paragraph', text: line, parts });
    }
  }

  return sections;
}

function parseInline(text: string): InlinePart[] {
  const result: InlinePart[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    result.push({ text: match[1], bold: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push({ text: text.slice(lastIndex), bold: false });
  }

  return result;
}

export default function Article() {
  const sections = useMemo(() => parseMarkdown(articleRaw), []);
  const [activeSection, setActiveSection] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useDidShow(() => {
    const target = Taro.getStorageSync('targetChapter');
    if (target) {
      Taro.removeStorageSync('targetChapter');
      setTimeout(() => {
        Taro.pageScrollTo({ selector: `#${target}`, duration: 300 });
      }, 600);
    }
  });

  usePageScroll((res) => {
    setScrollTop(res.scrollTop);
    setShowNav(res.scrollTop > 200);
    setShowBackTop(res.scrollTop > 400);

    const matchingSections = sections.filter((s) => {
      // Simple heuristic: active section based on scroll position
      return s.id !== '';
    });
    // Just highlight the section closest to scroll position
    const scrollRatio = res.scrollTop / Math.max(res.scrollHeight - Taro.getSystemInfoSync().windowHeight, 1);
    const sectionIndex = Math.min(
      Math.floor(scrollRatio * matchingSections.length),
      matchingSections.length - 1
    );
    if (matchingSections[sectionIndex]) {
      setActiveSection(matchingSections[sectionIndex].id);
    }
  });

  const handleNavClick = useCallback((sectionId: string) => {
    Taro.pageScrollTo({ selector: `#${sectionId}`, duration: 300 });
  }, []);

  const handleBackTop = useCallback(() => {
    Taro.pageScrollTo({ scrollTop: 0, duration: 300 });
  }, []);

  const chapterMeta = useMemo(() => {
    const map: Record<string, { label: string; shortLabel: string }> = {};
    for (const [title, id] of Object.entries(chapterIds)) {
      map[id] = { label: title, shortLabel: title.slice(0, 3) };
    }
    map['intro'] = { label: '引言', shortLabel: '引言' };
    map['conclusion'] = { label: '结语', shortLabel: '结语' };
    return map;
  }, []);

  const navSections = useMemo(() => sections.map((s) => ({ id: s.id, title: s.title })), [sections]);

  return (
    <View className="article-page">
      <View className="progress-bar" style={{ width: `${Math.min((scrollTop / 8000) * 100, 100)}%` }} />

      {showNav && (
        <View className="sticky-nav">
          <ScrollView scrollX className="nav-scroll" enhanced showScrollbar={false}>
            <View className="nav-items">
              {navSections.map((s) => (
                <View
                  key={s.id}
                  className={`nav-item ${activeSection === s.id ? 'nav-item-active' : ''}`}
                  onClick={() => handleNavClick(s.id)}
                >
                  <Text>{chapterMeta[s.id]?.shortLabel || s.title.slice(0, 3)}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {showBackTop && (
        <View className="back-to-top" onClick={handleBackTop}>
          <Text>↑</Text>
        </View>
      )}

      <ScrollView scrollY className="article-scroll" enhanced showScrollbar={false}>
        {sections.map((section, idx) => (
          <View key={section.id} id={section.id} className="section">
            <View className="section-header">
              <View className="section-divider-row">
                <View className="divider-line" />
                <Text className="section-label">
                  {idx === 0 ? 'PROLOGUE' : idx === sections.length - 1 ? 'EPILOGUE' : `CHAPTER ${idx}`}
                </Text>
                <View className="divider-line" />
              </View>
              <Text className="section-title">{section.title}</Text>
            </View>

            <View className="section-content">
              {section.blocks.map((block, bi) => {
                switch (block.type) {
                  case 'heading':
                    return <Text key={bi} className="content-h3">{block.text}</Text>;
                  case 'paragraph':
                    return (
                      <Text key={bi} className="content-p">
                        {block.parts.map((part, pi) =>
                          part.bold ? (
                            <Text key={pi} className="text-bold">{part.text}</Text>
                          ) : (
                            <Text key={pi}>{part.text}</Text>
                          )
                        )}
                      </Text>
                    );
                  case 'blockquote':
                    return (
                      <View key={bi} className="content-quote">
                        <Text className="quote-text">{block.text}</Text>
                      </View>
                    );
                  case 'hr':
                    return <View key={bi} className="content-hr" />;
                  case 'code':
                    return (
                      <View key={bi} className="content-code">
                        <Text className="code-text">{block.text}</Text>
                      </View>
                    );
                  default:
                    return null;
                }
              })}
            </View>
          </View>
        ))}

        <View className="article-footer">
          <Text className="footer-note">
            本文整合的理论来源包括：Kahneman & Tversky 的前景理论、Wolfram 的计算不可约性、
            Knight 的不确定性分类、Soros 的反身性理论、Taleb 的反脆弱与黑天鹅理论、
            Adams 的系统思维、Burt 的结构洞理论、Popper 的证伪主义、
            Dalio 的原则体系、古典的心智模式与跃迁理论、Naval 的自由公式、
            Fritz 的最小阻力之路理论、矛盾论与实事求是方法论、以及信息论中的赋能概念等。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}