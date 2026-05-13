import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ConceptCardProps {
  title: string;
  scholar?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function ConceptCard({ title, scholar, children, defaultOpen = false }: ConceptCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 rounded-lg border border-amber/20 bg-noir-800/50 hover:border-amber/40 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-amber-light group-hover:text-amber transition-colors">
              {title}
            </h4>
            {scholar && (
              <p className="text-xs text-noir-400 mt-1">{scholar}</p>
            )}
          </div>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-noir-400 text-lg"
          >
            ▾
          </motion.span>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 mx-2 border-l-2 border-amber/30 bg-noir-800/30 rounded-r-lg text-sm text-noir-200 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}