import { useState } from 'react';
import { Link } from 'react-router-dom';

const PAGE_DETAILS = {
  about: { title: 'About Us', sub: 'Voice of Oppressed · Independent digital platform' },
  contact: { title: 'Contact Us', sub: 'Communication, Feedback & News Tips' },
  editorial: { title: 'Editorial Policy', sub: 'Our standards for accuracy, fairness, and independence' },
  privacy: { title: 'Privacy Policy', sub: 'Data protection and reader confidentiality standards' },
  terms: { title: 'Terms & Conditions', sub: 'Guidelines for accessing and utilizing our news reports' },
  disclaimer: { title: 'Disclaimer', sub: 'Editorial independence and legal notices' },
};

export default function StaticPages({ type }) {
  const [sent, setSent] = useState(false);
  const current = PAGE_DETAILS[type] ?? PAGE_DETAILS.about;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link to="/" className="text-brand-blue dark:text-blue-400 text-xs font-bold mb-4 inline-block">← Back</Link>
      <header className="border-b border-gray-200 dark:border-brand-darkBorder pb-4 mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">{current.title}</h1>
        <p className="text-xs text-gray-500 mt-1">{current.sub}</p>
      </header>

      {type === 'contact' ? (
        <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="space-y-4 text-xs">
          {sent && (
            <div role="status" className="p-3 bg-blue-50 dark:bg-brand-blue/20 text-brand-blue dark:text-blue-300 rounded border border-blue-200">
              Inquiry submissions are currently in test mode. We have received your prompt.
            </div>
          )}
          <div>
            <label htmlFor="contact-name" className="block font-semibold mb-1 dark:text-gray-200">Full Name</label>
            <input id="contact-name" required type="text" className="w-full border rounded p-2.5 dark:bg-brand-darkCard dark:border-brand-darkBorder dark:text-white" />
          </div>
          <div>
            <label htmlFor="contact-email" className="block font-semibold mb-1 dark:text-gray-200">Email Address</label>
            <input id="contact-email" required type="email" className="w-full border rounded p-2.5 dark:bg-brand-darkCard dark:border-brand-darkBorder dark:text-white" />
          </div>
          <div>
            <label htmlFor="contact-message" className="block font-semibold mb-1 dark:text-gray-200">Message</label>
            <textarea id="contact-message" required rows="5" className="w-full border rounded p-2.5 dark:bg-brand-darkCard dark:border-brand-darkBorder dark:text-white" />
          </div>
          <button type="submit" className="bg-brand-blue text-white px-6 py-2.5 rounded font-bold hover:bg-blue-600">
            Send Message
          </button>
        </form>
      ) : (
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
          <p>
            Christian Monitor News is an independent digital news organization reporting on religious freedom, minority rights, and judicial justice in Pakistan and worldwide.
          </p>
          <p>
            Our core mission is to uphold human dignity, provide fact-based documentation, and bring ignored voices to light with full editorial integrity.
          </p>
          {type === 'editorial' && (
            <p>We aim to verify information, distinguish reporting from opinion, correct significant errors, and represent affected communities fairly.</p>
          )}
          {type === 'privacy' && (
            <p>This demonstration site does not send contact or newsletter form submissions to a server. Do not enter sensitive personal information.</p>
          )}
          {type === 'terms' && (
            <p>Articles are provided for general information. Please credit Christian Monitor News when quoting or sharing our reporting.</p>
          )}
          {type === 'disclaimer' && (
            <p>Articles reflect the information available at publication and may be updated as further facts are verified.</p>
          )}
        </div>
      )}
    </div>
  );
}
