const Collection = require('./collection.js');
const schema = {
  id: { type: 'string', required: true },
  name: { type: 'string', required: true },
  display_name: { type: 'string', required: true },
  description: { type: 'string' },
};

class Category extends Collection {}

module.exports = Category;
