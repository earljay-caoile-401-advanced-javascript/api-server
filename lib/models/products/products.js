'use strict';

const Collection = require('../collection.js');
const schema = {
  id: { type: 'string', required: true },
  category_id: { type: 'string', required: true },
  price: { type: 'number', required: true },
  weight: { type: 'number' },
  quantity_in_stock: { type: 'number', required: true },
};

class Products extends Collection {}

module.exports = new Products(schema);
