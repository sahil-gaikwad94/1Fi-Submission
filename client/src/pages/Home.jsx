// Lightweight Home tab placeholder matching the existing 1Fi app so the
// bottom-nav click feedback feels natural. (The assignment is scoped to the
// Shop page; this page is here purely for navigation completeness.)
export default function Home() {
  return (
    <div>
      <div className="hero">
        <div className="pill">GET STARTED</div>
        <h1>
          Shop on <span style={{ color: '#FFE009' }}>no-cost EMI</span>
        </h1>
        <p>Backed by your mutual funds, No credit pull, No charges, &amp; quick approval.</p>
      </div>
      <div className="card">
        <h3>Welcome to 1Fi</h3>
        <p>Open the Shop tab to explore the 1Fi Marketplace with live no-cost EMI options.</p>
      </div>
    </div>
  );
}
