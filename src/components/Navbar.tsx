import { motion } from 'framer-motion';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: 'landing' | 'article' | 'interactive' | 'principles') => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const links = [
    { id: 'landing' as const, label: '首页' },
    { id: 'article' as const, label: '文章' },
    { id: 'interactive' as const, label: '概念图' },
    { id: 'principles' as const, label: '原则' },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-noir-900/80 backdrop-blur-md border-b border-noir-700/50"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="text-xl font-serif font-bold tracking-wider text-amber hover:text-amber-light transition-colors"
        >
          树语世界
        </button>
        <div className="flex gap-8">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`text-sm tracking-wide transition-colors ${
                currentPage === link.id
                  ? 'text-amber border-b border-amber pb-0.5'
                  : 'text-noir-300 hover:text-noir-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}