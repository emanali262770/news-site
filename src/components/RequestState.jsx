export default function RequestState({ loading, error, onRetry }) {
  if (loading) return <p role="status" className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</p>;
  if (!error) return null;
  return (
    <div role="alert" className="px-4 py-6 text-center text-sm text-red-700 dark:text-red-400">
      <p>{error.message}</p>
      {onRetry && <button type="button" onClick={onRetry} className="mt-3 rounded border border-current px-4 py-2 font-semibold">Try again</button>}
    </div>
  );
}
