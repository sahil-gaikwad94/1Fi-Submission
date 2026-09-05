// Storage layer with two modes:
//   - MongoDB when MONGO_URI is set
//   - JSON file (`server/data/db.json`) otherwise, so the app runs on Render free tier
//
// Both modes expose an identical interface: getProducts(), getProductById(), getBrands(),
// createOrder(), getOrders().

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ProductModel = require('./models/Product');
const OrderModel = require('./models/Order');
const seed = require('./data/seed.json');

let mode = 'json';
let dbFile = null;

function isMongo() {
  return mode === 'mongo';
}

const JSON_PATH = path.join(__dirname, 'data', 'db.json');

function readJson() {
  if (!fs.existsSync(JSON_PATH)) {
    fs.writeFileSync(JSON_PATH, JSON.stringify({ products: seed.products, orders: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
}
function writeJson(data) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
}

async function initDb() {
  dbFile = readJson(); // ensure file exists, seed in place if missing
  if (process.env.MONGO_URI && process.env.MONGO_URI.trim().length > 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      mode = 'mongo';
      // Upsert seed products only if the collection is empty so reseeding doesn't duplicate
      const count = await ProductModel.countDocuments();
      if (count === 0) {
        await ProductModel.insertMany(seed.products);
        console.log('[db] seeded', seed.products.length, 'products into mongodb');
      } else {
        console.log('[db] mongodb already has', count, 'products — skipping seed');
      }
    } catch (err) {
      console.warn('[db] mongo connect failed, falling back to JSON file:', err.message);
      mode = 'json';
      await mongoose.disconnect().catch(() => {});
    }
  } else {
    mode = 'json';
  }
  return mode;
}

async function getProducts() {
  if (mode === 'mongo') {
    return ProductModel.find().sort({ createdAt: 1 }).lean();
  }
  return dbFile.products;
}

async function getProductById(id) {
  if (mode === 'mongo') {
    const p = await ProductModel.findById(id).lean();
    return p;
  }
  return dbFile.products.find((p) => p._id === id || p.id === id) || null;
}

async function getBrands() {
  const products = await getProducts();
  const seen = new Map();
  for (const p of products) {
    if (!p.brand) continue;
    if (!seen.has(p.brand)) seen.set(p.brand, { name: p.brand, productCount: 0 });
    seen.get(p.brand).productCount += 1;
  }
  return Array.from(seen.values());
}

async function createOrder(body) {
  const order = {
    _id: 'ord_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    ...body,
    createdAt: new Date().toISOString(),
  };
  if (mode === 'mongo') {
    const doc = await OrderModel.create(order);
    return doc.toObject();
  }
  dbFile.orders.unshift(order);
  writeJson(dbFile);
  return order;
}

async function getOrders() {
  if (mode === 'mongo') return OrderModel.find().sort({ createdAt: -1 }).lean();
  return dbFile.orders;
}

module.exports = { initDb, isMongo, getProducts, getProductById, getBrands, createOrder, getOrders };
