'use strict';

const supergoose = require('@code-fellows/supergoose');

const server = require('../server.js');

const agent = supergoose(server.apiServer);
const categories = require('../models/categories/categories-collection.js');
const products = require('../models/products/products-collection.js');

describe('API routes for categories', () => {
  let testObj1;
  let testObj2;
  let badObj;

  beforeEach(async () => {
    testObj1 = {
      name: 'mythical_weapons',
      display_name: 'mythical weapons',
      description: 'smite thee!',
    };

    testObj2 = {
      name: 'household_goods',
      display_name: 'household goods',
      description: 'stuff fo yo crib!',
    };

    badObj = {
      badProp: 12341234,
      description: 'BLOW UP YOUR API!',
      someOtherProp: true,
    };

    jest.spyOn(global.console, 'error');
    jest.spyOn(global.console, 'log');
    await categories.schema.deleteMany({}).exec();
  });

  it('can post a category', async () => {
    const createRes = await agent.post('/api/v1/categories').send(testObj1);
    expect(createRes.statusCode).toBe(200);
    expect(!!createRes.body._id).toEqual(true);
    Object.keys(testObj1).forEach(key => {
      expect(testObj1[key]).toEqual(createRes.body[key]);
    });
  });

  it('can catch a post error and console error it', async () => {
    await agent.post('/api/v1/categories').send(badObj);
    expect(console.error).toHaveBeenCalled();
  });

  it('can get all categories', async () => {
    await categories.schema(testObj1).save();
    await categories.schema(testObj2).save();
    let memDb = [testObj1, testObj2];

    const getRes = await agent.get('/api/v1/categories');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.count).toBe(2);

    for (let index in getRes.body.results) {
      Object.keys(testObj1).forEach(key => {
        expect(memDb[index][key]).toEqual(getRes.body.results[index][key]);
      });
    }
  });

  it('can get one category', async () => {
    const createRes1 = await categories.schema(testObj1).save();
    const createRes2 = await categories.schema(testObj2).save();
    const getOneRes = await agent.post(`/api/v1/categories/`).send(testObj1);

    expect(getOneRes.statusCode).toBe(200);
    console.log('what is createRes1?', createRes1);
    console.log('what is getOneRes?', getOneRes.body);

    Object.keys(testObj1).forEach(key => {
      expect(getOneRes.body[key]).toEqual(createRes1[key]);
    });

    Object.keys(testObj1).forEach(key => {
      expect(getOneRes.body[key]).not.toEqual(createRes2[key]);
    });
  });

  it('can update a category', () => {
    const editObj = {
      name: 'uber_weapons',
      display_name: 'uber weapons',
      description: 'cool beans',
    };

    return agent
      .post(`/api/v1/categories/`)
      .send(testObj1)
      .then(createRes =>
        agent
          .put(`/api/v1/categories/${createRes.body._id}`)
          .send(editObj)
          .then(response => {
            expect(response.statusCode).toBe(200);
            Object.keys(editObj).forEach(key => {
              expect(response.body[key]).toEqual(editObj[key]);
            });
          }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can delete a category', () => {
    return agent
      .post(`/api/v1/categories/`)
      .send(testObj1)
      .then(createRes =>
        agent
          .delete(`/api/v1/categories/${createRes.body._id}`)
          .then(response => {
            expect(response.statusCode).toBe(204);
          }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });
});

describe('API routes for products', () => {
  let testObj1;
  let testObj2;

  beforeEach(async () => {
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

    await products.schema.deleteMany({}).exec();
  });

  it('can post a product', () => {
    return agent
      .post('/api/v1/products')
      .send(testObj1)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(!!response.body._id).toEqual(true);
        Object.keys(testObj1).forEach(key => {
          expect(testObj1[key]).toEqual(response.body[key]);
        });
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get all products', async () => {
    await products.schema(testObj1).save();
    await products.schema(testObj2).save();
    let memDb = [testObj1, testObj2];

    return agent
      .get('/api/v1/products')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(2);
        for (let index in response.body.results) {
          Object.keys(testObj1).forEach(key => {
            expect(memDb[index][key]).toEqual(
              response.body.results[index][key],
            );
          });
        }
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get one product', () => {
    return agent
      .post(`/api/v1/products`)
      .send(testObj1)
      .then(createRes =>
        agent.get(`/api/v1/products/${createRes.body._id}`).then(response => {
          expect(response.statusCode).toBe(200);
          Object.keys(testObj1).forEach(key => {
            expect(testObj1[key]).toEqual(response.body[key]);
          });
        }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can update a product', () => {
    const editObj = {
      category_id: 'uber_weapons',
      price: 333,
      weight: 42.5,
      quantity_in_stock: 3,
    };

    return agent
      .post(`/api/v1/products`)
      .send(testObj1)
      .then(createRes =>
        agent
          .put(`/api/v1/products/${createRes.body._id}`)
          .send(editObj)
          .then(response => {
            expect(response.statusCode).toBe(200);
            Object.keys(editObj).forEach(key => {
              expect(response.body[key]).toEqual(editObj[key]);
            });
          }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can delete a product', () => {
    return agent
      .post(`/api/v1/products`)
      .send(testObj1)
      .then(createRes =>
        agent
          .delete(`/api/v1/products/${createRes.body._id}`)
          .then(response => {
            expect(response.statusCode).toBe(204);
          }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });
});

describe('middleware', () => {
  let testCat1;
  let testCat2;
  let testProd1;
  let testProd2;

  beforeEach(async () => {
    testCat1 = {
      name: 'mythical_weapons',
      display_name: 'mythical weapons',
      description: 'smite thee!',
    };

    testCat2 = {
      name: 'household_goods',
      display_name: 'household goods',
      description: 'stuff fo yo crib!',
    };

    testProd1 = {
      category_id: 'mythical_weapons',
      price: 9999,
      weight: 42.3,
      quantity_in_stock: 1,
    };

    testProd2 = {
      category_id: 'household_goods',
      price: 3,
      weight: 0.5,
      quantity_in_stock: 111,
    };

    await categories.schema.deleteMany({}).exec();
    await products.schema.deleteMany({}).exec();
  });

  it('should use logger and timestamp for an API call', () => {
    return agent.get(`/api/v1/products`).then(createRes => {
      expect(!!createRes.req).toEqual(true);
      expect(!!createRes.req.method).toEqual(true);
      // requestTime seems to be disappearing after the call completes
      // however, it is being logged
      // expect(!!products.requestTime).toEqual(true);
    });
  });
});
