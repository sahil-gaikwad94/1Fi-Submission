// Empty-state component for the "Top Brands" and "Nearby Stores" tabs.
// These two tabs are explicitly out-of-scope per the assignment — they just
// need to exist so the Shop page shows all three options.
export default function Placeholder({ title }) {
  return (
    <div className="placeholder" aria-label={title}>
      <div className="icon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 11l3-7h10l3 7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 11h16v9H4z" strokeLinejoin="round" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>
        This section will be available in a future release. For now, check out the{' '}
        <strong>1Fi Marketplace</strong> tab to shop on no-cost EMI.
      </p>
    </div>
  );
}
