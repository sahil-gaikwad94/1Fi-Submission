const express = require('express');
const router = express.Router();
const { getProductById, createOrder, getOrders } = require('../db');

function badRequest(message) {
  const e = new Error(message);
  e.status = 400;
  e.publicMessage = message;
  throw e;
}

router.get('/orders', async (_req, res, next) => {
  try {
    const items = await getOrders();
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.post('/orders', async (req, res, next) => {
  try {
    const { productId, variantId, emiTenureMonths, fullName, phone } = req.body || {};

    if (!productId) badRequest('productId is required');
    if (!variantId) badRequest('variantId is required');
    if (!emiTenureMonths) badRequest('emiTenureMonths is required');

    const product = await getProductById(productId);
    if (!product) {
      const e = new Error('Product not found');
      e.status = 404;
      e.publicMessage = 'Product not found';
      throw e;
    }

    const variant = (product.variants || []).find((v) => v.variantId === variantId);
    if (!variant) badRequest('Invalid variantId for this product');

    const plan = (product.emiPlans || []).find((p) => Number(p.tenureMonths) === Number(emiTenureMonths));
    if (!plan) badRequest('Invalid EMI tenure for this product');

    const order = await createOrder({
      productId,
      variantId,
      emiTenureMonths: Number(emiTenureMonths),
      monthlyAmount: plan.monthlyAmount,
      totalAmount: plan.totalAmount,
      fullName: (fullName || '').trim(),
      phone: (phone || '').trim(),
      productSnapshot: {
        id: product._id || product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        variantLabel: variant.label,
      },
      planSnapshot: { tenureMonths: plan.tenureMonths, cashback: plan.cashback, interestRatePercent: plan.interestRatePercent },
    });

    res.status(201).json({ order });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      err.status = 400;
      err.publicMessage = 'Validation failed';
    }
    next(err);
  }
});

module.exports = router;
