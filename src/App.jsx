import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RequestState from './components/RequestState';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { PostsProvider } from './context/PostsContext';
import ArticlesView from './views/ArticlesView';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import HomeView from './views/HomeView';
import ArticleDetailView from './views/ArticleDetailView';
import CategoryView from './views/CategoryView';
import SearchView from './views/SearchView';
import NewsletterView from './views/NewsletterView';
import StaticPages from './views/StaticPages';
import LoginView from './views/LoginView';
import AdminDashboardView from './views/AdminDashboardView';

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

function AuthRoute({ login = false }) {
  const auth = useAuth();
  if (auth.status === 'loading' || auth.status === 'error') return <RequestState loading={auth.status === 'loading'} error={auth.error} onRetry={auth.retry} />;
  if (login) return auth.admin ? <Navigate to="/admin" replace /> : <LoginView />;
  return auth.admin ? <AdminDashboardView /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <PostsProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomeView />} />
                <Route path="article/:slug" element={<ArticleDetailView />} />
                <Route path="post/:slug" element={<ArticleDetailView />} />
                <Route path="posts/:slug" element={<ArticleDetailView />} />
                <Route path="category/articles" element={<ArticlesView />} />
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
              <Route path="/login" element={<AuthRoute login />} />
              <Route element={
                <div className="min-h-screen bg-gray-50 font-sans text-gray-900 transition-colors duration-200 dark:bg-brand-darkBg dark:text-gray-100">
                  <main><Outlet /></main>
                </div>
              }>
                <Route path="/admin" element={<AuthRoute />} />
              </Route>
            </Routes>
          </PostsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
