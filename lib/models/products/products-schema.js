const mongoose = require('mongoose');

const products = mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  displayName: { type: String },
  description: { type: String },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('products', products);
