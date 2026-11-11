import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-brand-footer text-gray-300 pt-12 pb-6 text-sm">
      <div className="max-w-[1180px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div>
          <h4 className="font-serif text-white text-lg font-bold mb-2">Christian Monitor News</h4>
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-3">
            Voice of Oppressed
          </span>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Independent news covering Christian communities, religious freedom, minority rights, and human rights in Pakistan and worldwide.
          </p>
          <div className="flex gap-2">
            {['f', '𝕏', 'in', '▶'].map((icon, index) => (
              <span key={index} className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center font-bold text-xs hover:bg-brand-blue cursor-pointer">
                {icon}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-white text-base font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/category/latest" className="hover:underline">Latest News</Link></li>
            <li><Link to="/category/pakistan" className="hover:underline">Pakistan News</Link></li>
            <li><Link to="/category/world" className="hover:underline">World News</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-white text-base font-bold mb-3">Information</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/editorial" className="hover:underline">Editorial Policy</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms &amp; Conditions</Link></li>
            <li><Link to="/disclaimer" className="hover:underline">Disclaimer</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-white text-base font-bold mb-2">Stay Informed</h4>
          <p className="text-xs text-gray-400 mb-3">Receive weekly human rights briefings.</p>
          <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }} className="space-y-2">
            <input
              type="email"
              required
              placeholder="Your email address"
              aria-label="Your email address"
              className="w-full bg-white/10 border border-gray-600 rounded px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-brand-blue text-white py-2 rounded text-xs font-bold hover:bg-blue-600"
            >
              Subscribe
            </button>
            {subscribed && (
              <p role="status" className="text-[11px] text-blue-300 bg-blue-900/40 p-2 rounded">
                Subscription saved. Active service launch soon.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-4 pt-4 border-t border-gray-800 text-xs flex flex-wrap justify-between text-gray-400 gap-2">
        <span>© {new Date().getFullYear()} Christian Monitor News. All Rights Reserved.</span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/disclaimer" className="hover:underline">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
