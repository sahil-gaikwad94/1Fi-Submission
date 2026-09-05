const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getBrands } = require('../db');

const sortByName = (a, b) => (a.name || '').localeCompare(b.name || '');

// List format used by the UI: id + display-friendly fields + the cheapest EMI monthly
function toListItem(p) {
  const cheapest = (p.emiPlans || []).slice().sort((a, b) => a.tenureMonths - b.tenureMonths)[0];
  return {
    id: p._id || p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    shortDescription: p.shortDescription,
    image: p.image,
    imageBg: p.imageBg,
    price: p.price,
    mrp: p.mrp,
    rating: p.rating,
    reviewCount: p.reviewCount,
    emiTagline: p.emiTagline,
    cheapestMonthly: cheapest ? cheapest.monthlyAmount : null,
    cheapestTenureMonths: cheapest ? cheapest.tenureMonths : null,
  };
}

router.get('/products', async (req, res, next) => {
  try {
    const { brand, search } = req.query;
    let items = await getProducts();
    items = items.map(toListItem).sort(sortByName);
    if (brand) items = items.filter((p) => String(p.brand).toLowerCase() === String(brand).toLowerCase());
    if (search) {
      const q = String(search).toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.shortDescription || '').toLowerCase().includes(q)
      );
    }
    res.json({ items, count: items.length });
  } catch (err) {
    next(err);
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const p = await getProductById(req.params.id);
    if (!p) {
      const e = new Error('Product not found');
      e.status = 404;
      e.publicMessage = 'Product not found';
      throw e;
    }
    res.json({
      id: p._id || p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      image: p.image,
      imageBg: p.imageBg,
      shortDescription: p.shortDescription,
      description: p.description,
      highlights: p.highlights,
      price: p.price,
      mrp: p.mrp,
      rating: p.rating,
      reviewCount: p.reviewCount,
      emiTagline: p.emiTagline,
      variants: p.variants,
      emiPlans: p.emiPlans,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/brands', async (_req, res, next) => {
  try {
    const items = await getBrands();
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
