interface FooterProps {
  onNavigate: (page: 'landing' | 'article' | 'interactive' | 'principles') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-noir-700/50 bg-noir-900 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-lg font-serif text-amber mb-4">树语世界</h3>
        <p className="text-noir-400 text-sm mb-6">
          叙事场与赋能者 —— 一个系统性的世界理解模型
        </p>
        <div className="flex justify-center gap-6 text-sm text-noir-400">
          <button onClick={() => onNavigate('landing')} className="hover:text-noir-200 transition-colors">首页</button>
          <button onClick={() => onNavigate('article')} className="hover:text-noir-200 transition-colors">文章</button>
          <button onClick={() => onNavigate('interactive')} className="hover:text-noir-200 transition-colors">概念图</button>
          <button onClick={() => onNavigate('principles')} className="hover:text-noir-200 transition-colors">原则</button>
        </div>
        <p className="mt-8 text-xs text-noir-500">
          © 2026 树语世界 · 基于多学科理论构建 · 不确定性是意义的燃料
        </p>
      </div>
    </footer>
  );
}