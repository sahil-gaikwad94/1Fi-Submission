// One-shot seed script: `npm run seed` from the server folder ensures the JSON store has fresh seed data
const fs = require('fs');
const path = require('path');

const seed = require('../data/seed.json');
const dbPath = path.join(__dirname, '..', 'data', 'db.json');

fs.writeFileSync(dbPath, JSON.stringify({ products: seed.products, orders: [] }, null, 2), 'utf8');
console.log('[seed] wrote', seed.products.length, 'products to', dbPath);
