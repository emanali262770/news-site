import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { subscribeNewsletter } from '../lib/api';

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'info' | 'error', message: string }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);
      const res = await subscribeNewsletter(cleanEmail);
      const successMessage = res?.message || t('footer.subscribedSuccess') || 'Subscribed successfully! Thank you.';
      setFeedback({ type: 'success', message: successMessage });
      setEmail('');
    } catch (err) {
      const errMessage = err?.message || 'Failed to subscribe. Please try again.';
      setFeedback({ type: 'error', message: errMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-brand-footer text-gray-300 pt-12 pb-6 text-sm">
      <div className="max-w-[1180px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div>
          <h4 className="font-serif text-white text-lg font-bold mb-2">Christian Monitor News</h4>
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-3">
            {t('footer.voiceOfOppressed')}
          </span>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            {t('footer.description')}
          </p>
        </div>

        <div>
          <h4 className="font-serif text-white text-base font-bold mb-3">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:underline">{t('home')}</Link></li>
            <li><Link to="/category/latest" className="hover:underline">{t('latestNews')}</Link></li>
            <li><Link to="/category/pakistan" className="hover:underline">{t('categories.pakistan')}</Link></li>
            <li><Link to="/category/world" className="hover:underline">{t('categories.world')}</Link></li>
            <li><Link to="/about" className="hover:underline">{t('footer.aboutUs')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-white text-base font-bold mb-3">{t('footer.information')}</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/contact" className="hover:underline">{t('footer.contactUs')}</Link></li>
            <li><Link to="/editorial" className="hover:underline">{t('footer.editorial')}</Link></li>
            <li><Link to="/privacy" className="hover:underline">{t('footer.privacy')}</Link></li>
            <li><Link to="/terms" className="hover:underline">{t('footer.terms')}</Link></li>
            <li><Link to="/disclaimer" className="hover:underline">{t('footer.disclaimer')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-white text-base font-bold mb-2">{t('footer.stayInformed')}</h4>
          <p className="mb-3 text-xs text-gray-400">{t('footer.exploreLatest')}</p>
          
          <form onSubmit={handleSubscribe} className="mb-3 space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder') || 'Enter your email'}
                className="w-full rounded bg-gray-800/90 border border-gray-700 px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer whitespace-nowrap rounded bg-brand-blue hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-3 py-2 text-xs transition-colors flex items-center justify-center gap-1"
              >
                {loading ? '...' : (t('footer.subscribe') || 'Subscribe')}
              </button>
            </div>
            {feedback && (
              <p
                className={`text-xs font-medium ${
                  feedback.type === 'success'
                    ? 'text-green-400'
                    : feedback.type === 'info'
                    ? 'text-blue-300'
                    : 'text-rose-400'
                }`}
              >
                {feedback.type === 'success' ? '✓ ' : 'ℹ '}
                {feedback.message}
              </p>
            )}
          </form>

          <Link to="/category/latest" className="text-xs font-semibold text-blue-300 hover:underline inline-block mt-1">
            {t('footer.readLatest')}
          </Link>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-4 pt-4 border-t border-gray-800 text-xs flex flex-wrap justify-between text-gray-400 gap-2">
        <span>© {new Date().getFullYear()} Christian Monitor News. {t('footer.allRights')}</span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:underline">{t('footer.privacy')}</Link>
          <Link to="/terms" className="hover:underline">{t('footer.terms')}</Link>
          <Link to="/disclaimer" className="hover:underline">{t('footer.disclaimer')}</Link>
        </div>
      </div>
    </footer>
  );
}
