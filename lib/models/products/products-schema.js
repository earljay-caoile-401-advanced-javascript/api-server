const mongoose = require('mongoose');

const products = mongoose.Schema({
  category_id: { type: String, required: true },
  name: { type: String, require: true },
  display_name: { type: String, require: true },
  price: { type: Number, required: true },
  weight: { type: Number },
  quantity_in_stock: { type: Number, required: true },
});

module.exports = mongoose.model('products', products);
