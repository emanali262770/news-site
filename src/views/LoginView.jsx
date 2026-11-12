import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputClassName = 'mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-brand-darkBorder dark:bg-brand-darkBg dark:text-gray-100 dark:focus:border-blue-400';

export default function LoginView() {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try { await login(email.trim().toLowerCase(), password); }
    catch (error) { setError(error.message); }
    finally { setSubmitting(false); }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-[#f3f5f7] font-sans text-gray-900 dark:bg-brand-darkBg dark:text-gray-100">
      <div className="px-6 py-6 sm:px-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue dark:text-gray-400 dark:hover:text-blue-400">
          <span aria-hidden="true">&larr;</span> Back to website
        </Link>
      </div>
      <section className="flex flex-1 items-center justify-center px-5 py-8 sm:py-12" aria-labelledby="login-title">
      <div className="w-full max-w-[440px] rounded-xl border border-gray-200 bg-white p-7 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.2)] sm:p-10 dark:border-brand-darkBorder dark:bg-brand-darkCard">
        <header className="mb-8">
          <p className="border-b border-gray-100 pb-6 text-xs font-bold uppercase tracking-[0.16em] text-brand-blue dark:border-brand-darkBorder dark:text-blue-400">Christian Monitor <span className="font-normal text-gray-500 dark:text-gray-400">/ News</span></p>
          <p className="mb-2 mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">Administration</p>
          <h1 id="login-title" className="text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">Enter your credentials to access the admin dashboard.</p>
        </header>
        <form aria-busy={submitting} onSubmit={handleSubmit} onChange={() => error && setError('')} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-semibold">Email address</label>
            <input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" placeholder="Enter your email" required className={inputClassName} aria-describedby={error ? 'login-error' : undefined} aria-invalid={Boolean(error)} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold">Password</label>
            <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Enter your password" required className={inputClassName} aria-describedby={error ? 'login-error' : undefined} aria-invalid={Boolean(error)} />
            <button type="button" aria-controls="password" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="mt-2 text-xs font-semibold text-brand-blue hover:underline dark:text-blue-400">
              {showPassword ? 'Hide password' : 'Show password'}
            </button>
          </div>
          {error && <p id="login-error" role="alert" className="text-sm text-brand-red dark:text-red-400">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-brand-blue px-4 py-3 font-bold text-white transition-colors hover:bg-brand-blue/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue">
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
      </section>
      <p className="px-5 pb-6 text-center text-xs tracking-wide text-gray-500 dark:text-gray-400">Christian Monitor News &middot; Admin portal</p>
    </main>
  );
}
