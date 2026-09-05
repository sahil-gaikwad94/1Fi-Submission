import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../api.js';

export default function Marketplace() {
  const [products, setProducts] = useState(null);
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchApplied, setSearchApplied] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function load() {
    setError(null);
    try {
      const params = {};
      if (activeBrand) params.brand = activeBrand;
      if (searchApplied) params.search = searchApplied;
      const [{ items }, { items: brandItems }] = await Promise.all([api.listProducts(params), api.listBrands()]);
      setProducts(items); setBrands(brandItems);
    } catch (err) { setError(err); setProducts([]); }
  }

  useEffect(() => { load(); }, [activeBrand, searchApplied]);

  return (
    <div>
      <div className="toolbar">
        <button className="back" onClick={() => navigate('/shop')} aria-label="Back to Shop"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <div><div style={{ color: '#756f84', fontSize: 10, fontWeight: 800, letterSpacing: '.1em' }}>1FI SHOP</div><h2>Marketplace</h2></div>
      </div>
      <form className="search" onSubmit={(e) => { e.preventDefault(); setSearchApplied(searchInput.trim()); }} role="search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" strokeLinecap="round" /></svg>
        <input aria-label="Search marketplace" placeholder="Search products, brands & categories" value={searchInput} onChange={(e) => { setSearchInput(e.target.value); if (!e.target.value) setSearchApplied(''); }} />
        {searchInput && <button type="button" aria-label="Clear search" onClick={() => { setSearchInput(''); setSearchApplied(''); }} style={{ border: 0, background: 'transparent', color: '#756f84', fontSize: 18 }}>×</button>}
      </form>
      {brands.length > 0 && <div className="chips" role="tablist" aria-label="Filter by brand"><button className={'chip' + (!activeBrand ? ' active' : '')} onClick={() => setActiveBrand(null)} role="tab" aria-selected={!activeBrand}>All brands</button>{brands.map((b) => <button key={b.name} className={'chip' + (activeBrand === b.name ? ' active' : '')} onClick={() => setActiveBrand(b.name)} role="tab" aria-selected={activeBrand === b.name}>{b.name} · {b.productCount}</button>)}</div>}
      <div className="section-h">{searchApplied ? `Results for “${searchApplied}”` : 'Browse the collection'} {products && !error && <span style={{ color: '#9b96a9', fontSize: 11, fontFamily: 'Inter' }}>{products.length} items</span>}</div>
      {!products && !error && <Spinner label="Loading your marketplace…" />}
      {error && <div className="error-state"><strong>Couldn’t load the marketplace.</strong><div style={{ marginTop: 6 }}>{error.message}</div><button onClick={load}>Retry</button></div>}
      {products && products.length === 0 && !error && <div className="placeholder"><div className="icon"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" strokeLinecap="round" /></svg></div><h3>No products match</h3><p>Try another keyword or clear the selected brand filter.</p><button className="cta" style={{ marginTop: 16, maxWidth: 220 }} onClick={() => { setSearchInput(''); setSearchApplied(''); setActiveBrand(null); }}>Clear filters</button></div>}
      {products && products.length > 0 && <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
    </div>
  );
}
