// 1Fi Marketplace - Express server
// - Serves /api/* JSON endpoints
// - In production also serves the built React client (client/dist) on the same PORT
// - Works out-of-the-box: if MONGO_URI is unset, it uses an on-disk JSON store so it runs on Render free tier

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { initDb, isMongo } = require('./db');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json({ limit: '256kb' }));

// Serve product SVGs from server/public (used by /static/* URLs in seed.json).
// Path /static/products/iphone15.svg → server/public/products/iphone15.svg
const publicDir = path.resolve(__dirname, 'public');
app.use('/static', express.static(publicDir));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, storage: isMongo() ? 'mongodb' : 'json-file', uptime: process.uptime() });
});

app.use('/api', productsRouter);
app.use('/api', ordersRouter);

// Serve built client + SPA fallback (production). Vite dev server is used for local development.
const distDir = path.resolve(__dirname, '..', 'client', 'dist');
app.use(express.static(distDir));
app.get(/^\/(?!api).*/, (_req, res, next) => {
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) next();
  });
});

// Centralised error handler — keeps response shape consistent
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('[server] error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.publicMessage || (status === 500 ? 'Internal server error' : err.message),
  });
});

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await initDb();
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[server] storage: ${isMongo() ? 'mongodb' : 'json-file'}`);
    }
    app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[server] fatal:', err);
    process.exit(1);
  }
})();
