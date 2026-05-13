import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 滚动超过 400px 后显示按钮
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-amber/10 border border-amber/30 text-amber hover:bg-amber/20 hover:border-amber/50 transition-all duration-300 shadow-lg shadow-amber/5 backdrop-blur-sm group"
          aria-label="返回顶部"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp
            size={18}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
          
          {/* 悬停时的光晕效果 */}
          <div className="absolute inset-0 rounded-full bg-amber/0 group-hover:bg-amber/5 transition-all duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
