import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'intro', label: '引言' },
  { id: 'ch1', label: '一、世界的真相' },
  { id: 'ch2', label: '二、认知的枷锁' },
  { id: 'ch3', label: '三、决策的艺术' },
  { id: 'ch4', label: '四、赋能之路' },
  { id: 'ch5', label: '五、叙事行动' },
  { id: 'conclusion', label: '结语' },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
    >
      <div className="flex flex-col gap-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`text-right text-xs tracking-wide py-1.5 px-3 rounded-full transition-all duration-300 ${
              activeSection === section.id
                ? 'text-amber bg-amber/10 border-r-2 border-amber'
                : 'text-noir-500 hover:text-noir-300'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}