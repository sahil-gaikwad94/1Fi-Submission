const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    emiTenureMonths: { type: Number, required: true },
    monthlyAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },
    productSnapshot: { type: Object, default: {} },
    planSnapshot: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
