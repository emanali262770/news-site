import { Link } from 'react-router-dom';

export default function NewsletterView() {
  return <section className="mx-auto max-w-[850px] px-4 py-12"><h1 className="font-serif text-3xl font-bold">Newsletter</h1><p className="my-5 text-gray-500">Newsletter subscriptions are not available yet.</p><Link to="/category/latest" className="font-semibold text-brand-blue dark:text-blue-400">Read the latest news &rarr;</Link></section>;
}
