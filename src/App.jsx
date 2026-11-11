import { Link, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import HomeView from './views/HomeView';
import ArticleDetailView from './views/ArticleDetailView';
import CategoryView from './views/CategoryView';
import SearchView from './views/SearchView';
import NewsletterView from './views/NewsletterView';
import StaticPages from './views/StaticPages';

function NotFoundView() {
  return (
    <div className="text-center py-24">
      <h1 className="font-serif text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you requested could not be located.</p>
      <Link to="/" className="text-brand-blue dark:text-blue-400 font-bold hover:underline">
        Return to homepage
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeView />} />
          <Route path="article/:slug" element={<ArticleDetailView />} />
          <Route path="category/:categoryId" element={<CategoryView />} />
          <Route path="search" element={<SearchView />} />
          <Route path="newsletter" element={<NewsletterView />} />

          <Route path="about" element={<StaticPages type="about" />} />
          <Route path="contact" element={<StaticPages type="contact" />} />
          <Route path="editorial" element={<StaticPages type="editorial" />} />
          <Route path="privacy" element={<StaticPages type="privacy" />} />
          <Route path="terms" element={<StaticPages type="terms" />} />
          <Route path="disclaimer" element={<StaticPages type="disclaimer" />} />

          <Route path="*" element={<NotFoundView />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
