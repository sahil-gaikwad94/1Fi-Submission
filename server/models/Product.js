const mongoose = require('mongoose');

const EMIPerTenureSchema = new mongoose.Schema(
  {
    tenureMonths: { type: Number, required: true },
    monthlyAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    interestRatePercent: { type: Number, default: 0 },
    cashback: { type: Number, default: 0 },
    isRecommended: { type: Boolean, default: false },
  },
  { _id: false }
);

const VariantSchema = new mongoose.Schema(
  {
    variantId: { type: String, required: true },
    label: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    badge: { type: String, default: '' },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    _id: { type: String },
    id: { type: String, index: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, default: 'General' },
    image: { type: String, required: true },
    imageBg: { type: String, default: '#F4EEFF' },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    emiTagline: { type: String, default: '' },
    variants: { type: [VariantSchema], default: [] },
    emiPlans: { type: [EMIPerTenureSchema], default: [] },
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model('Product', ProductSchema);
