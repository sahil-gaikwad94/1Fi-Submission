import { formatINR } from '../api.js';

// List of EMI plan options for one product. Plans are computed by the server
// (recommended + cheapest tenures, etc) — this component just renders them
// and lets the user pick one. The currently-selected plan is highlighted.
export default function EMISelector({ emiPlans, selected, onSelect }) {
  if (!emiPlans || emiPlans.length === 0) {
    return <p style={{ color: '#6b6a7d', fontSize: 13.5 }}>No EMI plans available for this variant.</p>;
  }
  return (
    <div className="emi-list" role="radiogroup" aria-label="EMI plans">
      {emiPlans.map((plan) => {
        const isSelected = Number(selected) === Number(plan.tenureMonths);
        return (
          <label
            key={plan.tenureMonths}
            className={'emi-row' + (isSelected ? ' selected' : '')}
            onClick={() => onSelect(plan.tenureMonths)}
          >
            <input
              type="radio"
              name="emi-tenure"
              value={plan.tenureMonths}
              checked={isSelected}
              onChange={() => onSelect(plan.tenureMonths)}
              style={{ display: 'none' }}
            />
            <span className="radio" aria-hidden />
            <span className="eme-block">
              <div className="tenure">
                <span className="major">{formatINR(plan.monthlyAmount)}</span>
                <span className="minor">/ month · {plan.tenureMonths} mo</span>
              </div>
              <div className="price-line">
                Total: <strong>{formatINR(plan.totalAmount)}</strong>
                {plan.interestRatePercent === 0 && <> · 0% interest (no-cost EMI)</>}
              </div>
              {(plan.cashback > 0 || plan.isRecommended) && (
                <div className="tag-row">
                  {plan.isRecommended && <span className="tag-pill purple">Recommended</span>}
                  {plan.cashback > 0 && <span className="tag-pill green">{formatINR(plan.cashback)} cashback</span>}
                </div>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
