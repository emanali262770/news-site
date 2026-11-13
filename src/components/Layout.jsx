import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-brand-darkBg text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 overflow-x-hidden w-full">
      <TopBar />
      <Header />
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
