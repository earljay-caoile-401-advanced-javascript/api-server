'use strict';

const supergoose = require('@code-fellows/supergoose');

const server = require('../lib/server.js');

const agent = supergoose(server.apiServer);
const products = require('../lib/models/products/products.js');
const uuid = require('uuid/v4');

describe('API routes for products', () => {
  let testObj1;
  let testObj2;

  beforeEach(() => {
    testObj1 = {
      category_id: 'mythical_weapons',
      price: 9999,
      weight: 42.3,
      quantity_in_stock: 1,
    };

    testObj2 = {
      category_id: 'household_goods',
      price: 3,
      weight: 0.5,
      quantity_in_stock: 111,
    };

    products.database = [];
  });

  it('can post a product', () => {
    return agent
      .post('/api/v1/products')
      .send(testObj1)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(!!response.body.id).toEqual(true);
        Object.keys(testObj1).forEach(key => {
          expect(testObj1[key]).toEqual(response.body[key]);
        });
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get all products', () => {
    testObj1.id = uuid();
    products.database.push(testObj1);
    testObj2.id = uuid();
    products.database.push(testObj2);

    return agent
      .get('/api/v1/products')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(2);
        for (let index in response.body.results) {
          Object.keys(testObj1).forEach(key => {
            expect(products.database[index][key]).toEqual(
              response.body.results[index][key],
            );
          });
        }
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get one product', () => {
    testObj1.id = uuid();
    products.database.push(testObj1);

    return agent
      .get(`/api/v1/products/${testObj1.id}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        Object.keys(testObj1).forEach(key => {
          expect(products.database[key]).toEqual(response.body[key]);
        });
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can update a product', () => {
    testObj1.id = uuid();
    products.database.push(testObj1);
    const editObj = {
      category_id: 'mythical_weapons',
      price: 3333,
      weight: 42,
      quantity_in_stock: 2,
    };

    return agent
      .put(`/api/v1/products/${testObj1.id}`)
      .send(editObj)
      .then(response => {
        expect(response.statusCode).toBe(200);
        Object.keys(editObj).forEach(key => {
          expect(response.body[key]).toEqual(editObj[key]);
        });
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can delete a product', () => {
    testObj1.id = uuid();
    products.database.push(testObj1);
    return agent
      .delete(`/api/v1/products/${testObj1.id}`)
      .then(response => {
        expect(response.statusCode).toBe(204);
      })
      .catch(error => expect(error).not.toBeDefined());
  });
});
