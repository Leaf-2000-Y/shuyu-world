import { useState } from 'react';

interface QuoteHighlightProps {
  children: React.ReactNode;
}

export default function QuoteHighlight({ children }: QuoteHighlightProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="relative my-8 pl-6 border-l-2 border-amber/50 group">
      <p className="text-lg text-noir-100 italic leading-relaxed py-2">
        {children}
      </p>
      <button
        onClick={() => setSaved(!saved)}
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-noir-400 hover:text-amber"
      >
        {saved ? '★ 已收藏' : '☆ 收藏'}
      </button>
    </div>
  );
}