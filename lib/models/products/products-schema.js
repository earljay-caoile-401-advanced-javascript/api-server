const mongoose = require('mongoose');

const products = mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  display_name: { type: String },
  description: { type: String },
});

module.exports = mongoose.model('products', products);
