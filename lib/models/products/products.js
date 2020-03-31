'use strict';

const Collection = require('../collection.js');

class Products extends Collection {
  constructor() {
    super();
    this.schema = {
        id: { type: 'string', required: true },
        category_id: { type: 'string', required: true },
        price: { type: 'number', required: true },
        weight: { type: 'number' },
        quantity_in_stock: { type: 'number', required: true },
    };
  }
}

module.exports = new Products();