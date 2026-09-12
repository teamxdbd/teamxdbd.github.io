import { useHashRoute } from '@/hooks/useHashRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TelegramBanner } from '@/components/TelegramBanner';
import { HomePage } from '@/pages/HomePage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ToolPage } from '@/pages/ToolPage';
import { ContactPage, ReportPage } from '@/pages/ContactReportPages';

function App() {
  const { route, navigate } = useHashRoute();

  const renderRoute = () => {
    if (route === '/' || route === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (route === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (route === '/report') {
      return <ReportPage onNavigate={navigate} />;
    }

    const categoryMatch = route.match(/^\/category\/(.+)$/);
    if (categoryMatch) {
      return <CategoryPage categoryId={categoryMatch[1]} onNavigate={navigate} />;
    }

    const toolMatch = route.match(/^\/tool\/(.+)$/);
    if (toolMatch) {
      return <ToolPage slug={toolMatch[1]} onNavigate={navigate} />;
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg">Page not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-cyan-400 hover:text-cyan-300">
          Back to Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <TelegramBanner />
      <Header onNavigate={navigate} onSearchSelect={(slug) => navigate(`/tool/${slug}`)} />
      <main className="flex-1">{renderRoute()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
