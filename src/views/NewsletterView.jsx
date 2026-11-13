import { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from '../lib/api';

export default function NewsletterView() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
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
      setFeedback({ type: 'success', message: res?.message || 'Subscribed successfully! Thank you.' });
      setEmail('');
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to subscribe. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-[650px] px-4 py-16">
      <div className="rounded-xl border border-gray-200 dark:border-brand-darkBorder bg-white dark:bg-brand-darkCard p-8 shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-3">Newsletter</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
          Stay connected with unbiased reporting, breaking news, and in-depth analysis delivered directly to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newsletter-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 dark:border-brand-darkBorder bg-gray-50 dark:bg-gray-800/80 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-brand-blue hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>

        {feedback && (
          <div
            className={`mt-4 rounded-md p-3 text-sm ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-brand-darkBorder">
          <Link to="/category/latest" className="text-sm font-semibold text-brand-blue dark:text-blue-400 hover:underline">
            &larr; Back to latest news
          </Link>
        </div>
      </div>
    </section>
  );
}
