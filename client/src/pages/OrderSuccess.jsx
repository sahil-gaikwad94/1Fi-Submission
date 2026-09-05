import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatINR } from '../api.js';

// Order confirmation screen shown after the user picks an EMI plan and
// taps "Proceed". The order payload is passed via navigation state.
export default function OrderSuccess() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const order = state?.order;
  const product = state?.product;
  const variant = state?.variant;
  const plan = state?.plan;

  return (
    <div>
      <div className="success-card">
        <div className="check" aria-hidden>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2>Order placed 🎉</h2>
        <p style={{ color: '#6b6a7d', fontSize: 13.5, margin: '6px 0 0' }}>
          Your EMI plan for {product?.name ?? id} is active. You'll be notified when it ships.
        </p>
        <div className="meta">
          <div>
            <span>Order ID</span>
            <strong>{order?._id || '—'}</strong>
          </div>
          <div>
            <span>Variant</span>
            <strong>{variant?.label || '—'}</strong>
          </div>
          <div>
            <span>Monthly EMI</span>
            <strong>
              {formatINR(order?.monthlyAmount)} × {order?.emiTenureMonths} mo
            </strong>
          </div>
          <div>
            <span>Total payable</span>
            <strong>{formatINR(order?.totalAmount)}</strong>
          </div>
          {plan?.cashback > 0 && (
            <div>
              <span>Cashback</span>
              <strong>{formatINR(plan.cashback)}</strong>
            </div>
          )}
        </div>
        <button className="cta" style={{ marginTop: 24 }} onClick={() => navigate('/shop/marketplace')}>
          Continue shopping
        </button>
      </div>
    </div>
  );
}
