import { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import ArticlePage from './components/ArticlePage';
import InteractivePage from './components/InteractivePage';
import PrinciplesPage from './components/PrinciplesPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

type Page = 'landing' | 'article' | 'interactive' | 'principles';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-noir-900 text-noir-50 font-serif">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main>
        {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
        {currentPage === 'article' && <ArticlePage />}
        {currentPage === 'interactive' && <InteractivePage />}
        {currentPage === 'principles' && <PrinciplesPage />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;