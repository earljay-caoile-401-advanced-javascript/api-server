'use strict';

const Collection = require('./collection.js');
const schema = {
  id: { type: 'string', required: true },
  category: { type: 'string', required: true },
  name: { type: 'string', required: true },
  display_name: { type: 'string' },
  description: { type: 'string' },
};

class Products extends Collection {}

module.exports = new Products(schema);
