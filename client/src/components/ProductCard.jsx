import { Link } from 'react-router-dom';
import { formatINR } from '../api.js';

export default function ProductCard({ product }) {
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  return (
    <Link to={`/shop/marketplace/${product.id}`} className="product-card" aria-label={`View ${product.name}`}>
      <div className="imgbox" style={{ background: product.imageBg || '#F4EEFF' }}><img src={product.image} alt={product.name} loading="lazy" /></div>
      <div className="pbrand">{product.brand}</div>
      <div className="pname">{product.name}</div>
      <div className="prices"><span className="now">{formatINR(product.price)}</span>{product.mrp > product.price && <span className="strike">{formatINR(product.mrp)}</span>}</div>
      {discount > 0 && <div className="offer">{discount}% OFF</div>}
      {product.rating && <div style={{ margin: '7px 3px 0', color: '#b97800', fontSize: 10, fontWeight: 800 }}>★ {product.rating} <span style={{ color: '#aaa5b5', fontWeight: 600 }}>({product.reviewCount?.toLocaleString('en-IN')})</span></div>}
      {product.emiTagline && <div className="emi-tag">{product.emiTagline}</div>}
    </Link>
  );
}
