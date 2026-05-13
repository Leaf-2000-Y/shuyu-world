import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface StickyNavProps {
  sections: { id: string; title: string }[];
}

export default function StickyNav({ sections }: StickyNavProps) {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);

  // 检测当前活跃章节
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  // 控制导航栏显示/隐藏
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 超过 200px 后显示导航栏
      if (currentScrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滚动到指定章节
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // 计算导航栏高度偏移
      const navHeight = navRef.current?.offsetHeight || 64;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  // 简化章节标题显示
  const getShortTitle = (title: string): string => {
    if (title.includes('引言')) return '引言';
    if (title.includes('第一章') || title.includes('一、')) return '世界的真相';
    if (title.includes('第二章') || title.includes('二、')) return '认知的枷锁';
    if (title.includes('第三章') || title.includes('三、')) return '决策的艺术';
    if (title.includes('第四章') || title.includes('四、')) return '赋能之路';
    if (title.includes('第五章') || title.includes('五、')) return '叙事行动';
    if (title.includes('结语')) return '结语';
    return title;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          ref={navRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-16 left-0 right-0 z-40 bg-noir-900/95 backdrop-blur-md border-b border-noir-800/50"
        >
          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center justify-center px-6 h-14">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`relative px-4 py-2 text-xs tracking-wide whitespace-nowrap transition-all duration-300 rounded-full ${
                    activeSection === section.id
                      ? 'text-amber font-medium'
                      : 'text-noir-400 hover:text-noir-200 hover:bg-noir-800/50'
                  }`}
                >
                  {getShortTitle(section.title)}
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 移动端导航 */}
          <div className="md:hidden flex items-center justify-between px-4 h-14">
            <span className="text-xs text-amber font-medium tracking-wider">
              {activeSection ? getShortTitle(sections.find(s => s.id === activeSection)?.title || '') : '目录'}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-noir-400 hover:text-noir-200 hover:bg-noir-800/50 transition-colors"
              aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* 移动端下拉菜单 */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden border-t border-noir-800/50"
              >
                <div className="py-2 px-4 space-y-1 bg-noir-900/98">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'text-amber bg-amber/10 font-medium'
                          : 'text-noir-400 hover:text-noir-200 hover:bg-noir-800/30'
                      }`}
                    >
                      {getShortTitle(section.title)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
