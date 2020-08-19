const mongoose = require('mongoose');

const favorites = mongoose.Schema({
  userID: { type: String, required: true },
  list: { type: Array, required: true },
});

module.exports = mongoose.model('favorites', favorites);
