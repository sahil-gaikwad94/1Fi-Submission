// Tiny fetch wrapper used everywhere in the SPA. Keeps network errors
// explicit so each page can render a proper error/loading state instead
// of crashing when the API is briefly unavailable.
async function request(path, init) {
  const url = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? '' : '/'}${path}`;
  let res;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(init && init.headers) },
      ...init,
    });
  } catch (err) {
    const e = new Error('Network error — please check your connection');
    e.cause = err;
    throw e;
  }
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const e = new Error(data.error || data.publicMessage || `Request failed (${res.status})`);
    e.status = res.status;
    throw e;
  }
  return data;
}

export const api = {
  listProducts(params = {}) {
    const q = new URLSearchParams();
    if (params.brand) q.set('brand', params.brand);
    if (params.search) q.set('search', params.search);
    const qs = q.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getProduct(id) {
    return request(`/products/${encodeURIComponent(id)}`);
  },
  listBrands() {
    return request('/brands');
  },
  createOrder(payload) {
    return request('/orders', { method: 'POST', body: JSON.stringify(payload) });
  },
  listOrders() {
    return request('/orders');
  },
};

export function formatINR(n) {
  if (n == null) return '—';
  return '₹' + Number(n).toLocaleString('en-IN');
}
