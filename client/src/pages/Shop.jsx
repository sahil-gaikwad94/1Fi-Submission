import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Placeholder from './Placeholder.jsx';

export default function Shop() {
  const [tab, setTab] = useState('marketplace');
  const navigate = useNavigate();

  return (
    <div>
      <div className="topline">
        <div className="brandmark"><b>1</b> 1Fi</div>
        <button className="avatar" aria-label="Open profile" onClick={() => navigate('/profile')}>SG</button>
      </div>
      <div className="hero">
        <div className="pill">SHOP SMARTER WITH 1FI</div>
        <h1>Make room for the things you <em>really want.</em></h1>
        <p>Use your investments to unlock no-cost EMI on the products and experiences you care about.</p>
      </div>

      <div className="tabs" role="tablist" aria-label="Shop categories">
        {[
          ['top', 'Top Brands'],
          ['nearby', 'Nearby Stores'],
          ['marketplace', '1Fi Marketplace'],
        ].map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? 'active' : ''} onClick={() => key === 'marketplace' ? setTab(key) : setTab(key)}>{label}</button>
        ))}
      </div>

      {tab === 'top' && <Placeholder title="Top Brands" />}
      {tab === 'nearby' && <Placeholder title="Nearby Stores" />}
      {tab === 'marketplace' && <MarketplaceTeaser navigate={navigate} />}
    </div>
  );
}

function MarketplaceTeaser({ navigate }) {
  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, #fff, #f5f0ff)' }}>
        <div style={{ color: '#6428d7', fontSize: 11, fontWeight: 800, letterSpacing: '.1em' }}>CURATED FOR YOU</div>
        <div className="section-h" style={{ margin: '8px 0 4px' }}>Everything you need, on EMI <span style={{ fontSize: 26 }}>↗</span></div>
        <p>Phones, laptops, travel and more from trusted brands. Transparent pricing, flexible plans.</p>
        <button className="cta" style={{ marginTop: 16 }} onClick={() => navigate('/shop/marketplace')}>Explore marketplace</button>
      </div>
      <div className="search" role="button" tabIndex={0} onClick={() => navigate('/shop/marketplace')} onKeyDown={(e) => e.key === 'Enter' && navigate('/shop/marketplace')}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" strokeLinecap="round" /></svg>
        <span style={{ color: '#9b96a9', fontSize: 14 }}>Search products, brands &amp; categories</span>
      </div>
      <div className="section-h">Why shop with 1Fi <Link className="section-link" to="/shop/marketplace">See all</Link></div>
      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {[['0%','No-cost EMI'],['₹0','Down payment'],['100%','Transparent']].map(([value, label]) => <div className="card" key={label} style={{ padding: 13, margin: 0 }}><div style={{ color: '#6428d7', fontSize: 20, fontWeight: 850 }}>{value}</div><div style={{ color: '#756f84', fontSize: 11, marginTop: 5 }}>{label}</div></div>)}
      </div>
    </div>
  );
}
