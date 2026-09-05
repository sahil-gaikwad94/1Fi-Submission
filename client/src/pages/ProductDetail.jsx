import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EMISelector from '../components/EMISelector.jsx';
import Spinner from '../components/Spinner.jsx';
import { api, formatINR } from '../api.js';

// Product detail page for the 1Fi Marketplace.
// Shows: image, name, brand, price/MRP, description, highlights, variants,
// EMI plans with selectable + recommended chip, sticky CTA to proceed.
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [variantId, setVariantId] = useState(null);
  const [tenure, setTenure] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function load() {
    setError(null);
    try {
      const p = await api.getProduct(id);
      setProduct(p);
      // Pick first variant and its recommended tenure (fallback: cheapest/monthly defaulted)
      const first = p.variants && p.variants[0];
      const dv = first?.variantId;
      setVariantId(dv || null);
      if (p.emiPlans && p.emiPlans.length) {
        const rec = p.emiPlans.find((x) => x.isRecommended);
        setTenure(rec ? rec.tenureMonths : p.emiPlans[0].tenureMonths);
      }
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const selectedVariant = useMemo(
    () => (product ? product.variants.find((v) => v.variantId === variantId) || null : null),
    [product, variantId]
  );
  const selectedPlan = useMemo(
    () => (product ? product.emiPlans.find((x) => Number(x.tenureMonths) === Number(tenure)) || null : null),
    [product, tenure]
  );

  async function proceed() {
    if (!product || !variantId || !tenure) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { order } = await api.createOrder({
        productId: product.id,
        variantId,
        emiTenureMonths: tenure,
      });
      navigate(`/shop/marketplace/${product.id}/success`, { state: { order, product, variant: selectedVariant, plan: selectedPlan } });
    } catch (err) {
      setSubmitError(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div>
        <div className="toolbar">
          <button className="back" onClick={() => navigate('/shop/marketplace')}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2>Product</h2>
        </div>
        <div className="error-state">
          <strong>Couldn't load this product.</strong>
          <div style={{ fontSize: 13 }}>{error.message}</div>
          <button onClick={load}>Retry</button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <div className="toolbar">
          <button className="back" onClick={() => navigate(-1)} aria-label="Back">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2>Product</h2>
        </div>
        <Spinner label="Loading product…" />
      </div>
    );
  }

  const savings = product.mrp > product.price ? product.mrp - product.price : 0;

  return (
    <div>
      <div className="toolbar">
        <button className="back" onClick={() => navigate(-1)} aria-label="Back">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2>{product.brand}</h2>
      </div>

      <div className="detail-hero">
        <div className="imgwrap" style={{ background: product.imageBg || '#F4EEFF' }}>
          <img src={product.image} alt={product.name} />
        </div>
        <div>
          <h3 className="dname">{product.name}</h3>
          <div className="dbrand">{product.brand}</div>
          <div className="star" aria-label={`Rated ${product.rating} out of 5`}>
            ★ {product.rating} · {product.reviewCount.toLocaleString('en-IN')} reviews
          </div>
          <div className="dprice-row">
            <span className="now">{formatINR(product.price)}</span>
            {product.mrp > product.price && <span className="strike">{formatINR(product.mrp)}</span>}
          </div>
          {savings > 0 && <div className="dsave">You save {formatINR(savings)}</div>}
          {product.emiTagline && (
            <div className="emi-tag" style={{ marginTop: 10 }}>
              {product.emiTagline}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3>About this product</h3>
        <p>{product.description}</p>
        {product.highlights && product.highlights.length > 0 && (
          <ul className="highlights" aria-label="Highlights" style={{ marginTop: 12 }}>
            {product.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </div>

      {product.variants && product.variants.length > 1 && (
        <div className="card">
          <h3>Choose variant</h3>
          <div className="variant-list" role="radiogroup" aria-label="Variants">
            {product.variants.map((v) => (
              <label
                key={v.variantId}
                className={'variant' + (variantId === v.variantId ? ' selected' : '')}
                onClick={() => setVariantId(v.variantId)}
              >
                <input
                  type="radio"
                  name="variant"
                  value={v.variantId}
                  checked={variantId === v.variantId}
                  onChange={() => setVariantId(v.variantId)}
                  style={{ display: 'none' }}
                />
                <span className="dot" aria-hidden />
                <span className="vlabel">{v.label}</span>
                {v.badge && <span className="vbadge">{v.badge}</span>}
                <span className="vprice">{formatINR(v.price)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3>Choose an EMI plan</h3>
        <p style={{ marginBottom: 10 }}>
          Pay for your order in monthly installments with 0% interest when you pay on time.
        </p>
        <EMISelector emiPlans={product.emiPlans} selected={tenure} onSelect={setTenure} />
      </div>

      {submitError && (
        <div className="error-state" style={{ marginBottom: 12 }}>
          <strong>Couldn't place the order.</strong>
          <div style={{ fontSize: 13 }}>{submitError.message}</div>
          <button onClick={proceed}>Retry</button>
        </div>
      )}

      <div className="cta-bar">
        <button className="cta" disabled={!tenure || !variantId || submitting} onClick={proceed}>
          {submitting
            ? 'Placing your order…'
            : tenure
            ? `Proceed · ${formatINR(selectedPlan?.monthlyAmount)} / month`
            : 'Proceed with this plan'}
        </button>
      </div>
    </div>
  );
}
