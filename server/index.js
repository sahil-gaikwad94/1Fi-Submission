// 1Fi Marketplace - Express server

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

// Serve product images and other public assets.
const publicDir = path.resolve(__dirname, 'public');
app.use('/static', express.static(publicDir));

// Health endpoint.
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    storage: isMongo() ? 'mongodb' : 'json-file',
    uptime: process.uptime()
  });
});

// API routes.
app.use('/api', productsRouter);
app.use('/api', ordersRouter);

// Serve the compiled React frontend.
const distDir = path.resolve(__dirname, '..', 'client', 'dist');

app.use(express.static(distDir));

// React Router fallback.
app.get(/^\/(?!api).*/, (_req, res, next) => {
  const indexFile = path.join(distDir, 'index.html');

  res.sendFile(indexFile, (err) => {
    if (err) {
      next(err);
    }
  });
});

// Centralized error handler.
app.use((err, _req, res, _next) => {
  console.error('[server] error:', err);

  const status = err.status || 500;

  res.status(status).json({
    error:
      err.publicMessage ||
      (status === 500 ? 'Internal server error' : err.message)
  });
});

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await initDb();

    console.log(
      `[server] storage: ${isMongo() ? 'mongodb' : 'json-file'}`
    );

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[server] listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('[server] fatal:', err);
    process.exit(1);
  }
})();

