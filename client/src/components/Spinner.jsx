// Tiny spinner used while async data is loading.
export default function Spinner({ label }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <div className="ring" />
      {label ? <span style={{ marginLeft: 10, color: '#6b6a7d', fontSize: 13 }}>{label}</span> : null}
    </div>
  );
}
