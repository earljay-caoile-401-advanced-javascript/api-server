const mongoose = require('mongoose');

const todo = mongoose.Schema({
  assignee: { type: String, required: true },
  complete: { type: Boolean, required: true },
  difficulty: { type: Number, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model('todo', todo);
