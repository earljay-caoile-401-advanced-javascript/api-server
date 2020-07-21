const mongoose = require('mongoose');

const categories = mongoose.Schema({
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model('categories', categories);
