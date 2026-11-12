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
  const current = PAGE_DETAILS[type] ?? PAGE_DETAILS.about;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link to="/" className="text-brand-blue dark:text-blue-400 text-xs font-bold mb-4 inline-block">← Back</Link>
      <header className="border-b border-gray-200 dark:border-brand-darkBorder pb-4 mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">{current.title}</h1>
        <p className="text-xs text-gray-500 mt-1">{current.sub}</p>
      </header>

      {type === 'contact' ? (
<p className="text-sm text-gray-500 dark:text-gray-400">Online contact submissions are not available yet.</p>
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
            <p>Contact and newsletter submissions are not currently available. Admin access uses a session cookie.</p>
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
