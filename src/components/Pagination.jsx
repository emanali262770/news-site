export default function Pagination({ pagination, onPageChange, disabled = false }) {
  if (!pagination) return null;
  const { page, limit, total, totalPages } = pagination;
  const lastPage = Math.max(1, totalPages);
  const buttonClass = 'rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-brand-darkBorder focus-visible:outline-2 focus-visible:outline-brand-blue';
  return (
    <nav aria-label="Posts pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 dark:border-brand-darkBorder">
      <p role="status" className="text-sm text-gray-500 dark:text-gray-400">Showing {total ? (page - 1) * limit + 1 : 0}–{Math.min(page * limit, total)} of {total} posts</p>
      <div className="flex items-center gap-3">
        <button type="button" className={buttonClass} disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
        <span className="text-sm">Page {page} of {lastPage}</span>
        <button type="button" className={buttonClass} disabled={disabled || page >= lastPage} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </nav>
  );
}
