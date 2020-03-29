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
    jest.spyOn(global.console, 'error');
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
    const getOneRes = await agent.get(`/api/v1/categories/${createRes1._id}`);

    expect(getOneRes.statusCode).toBe(200);
    expect(getOneRes.body._id.toString()).toBe(createRes1._id.toString());

    Object.keys(testObj1).forEach(key => {
      expect(getOneRes.body[key]).toEqual(createRes1[key]);
    });

    Object.keys(testObj1).forEach(key => {
      expect(getOneRes.body[key]).not.toEqual(createRes2[key]);
    });
  });

  it('can update a category', async () => {
    const editObj = {
      name: 'uber_weapons',
      display_name: 'uber weapons',
      description: 'cool beans',
    };

    const createRes = await agent.post(`/api/v1/categories/`).send(testObj1);
    const updateRes = await agent
      .put(`/api/v1/categories/${createRes.body._id}`)
      .send(editObj);

    expect(updateRes.statusCode).toBe(200);
    Object.keys(editObj).forEach(key => {
      expect(updateRes.body[key]).toEqual(editObj[key]);
    });
  });

  it('can delete a category', async () => {
    const createRes = await categories.schema(testObj1).save();
    const deleteRes = await agent.delete(`/api/v1/categories/${createRes._id}`);
    expect(deleteRes.statusCode).toBe(204);
    const getOneRes = await agent.get(`/api/v1/categories/${createRes._id}`);
    expect(getOneRes.body).toEqual(null);
  });
});

describe('API routes for products', () => {
  let testObj1;
  let testObj2;
  let badObj;

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

    badObj = {
      category_id: 22341234,
      price: true,
      weight: '234',
    };

    await products.schema.deleteMany({}).exec();
  });

  it('can post a product', async () => {
    const createRes = await agent.post('/api/v1/products').send(testObj1);
    expect(createRes.statusCode).toBe(200);
    expect(!!createRes.body._id).toEqual(true);
    Object.keys(testObj1).forEach(key => {
      expect(testObj1[key]).toEqual(createRes.body[key]);
    });
  });

  it('can catch a post error and console error it', async () => {
    jest.spyOn(global.console, 'error');
    await agent.post('/api/v1/products').send(badObj);
    expect(console.error).toHaveBeenCalled();
  });

  it('can get all products', async () => {
    await products.schema(testObj1).save();
    await products.schema(testObj2).save();
    let memDb = [testObj1, testObj2];

    const getRes = await agent.get('/api/v1/products');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.count).toBe(2);

    for (let index in getRes.body.results) {
      Object.keys(testObj1).forEach(key => {
        expect(memDb[index][key]).toEqual(getRes.body.results[index][key]);
      });
    }
  });

  it('can get one product', async () => {
    const createRes1 = await products.schema(testObj1).save();
    const createRes2 = await products.schema(testObj2).save();
    const getOneRes = await agent.get(`/api/v1/products/${createRes1._id}`);

    expect(getOneRes.statusCode).toBe(200);
    expect(getOneRes.body._id.toString()).toBe(createRes1._id.toString());

    Object.keys(testObj1).forEach(key => {
      expect(getOneRes.body[key]).toEqual(createRes1[key]);
    });

    Object.keys(testObj1).forEach(key => {
      expect(getOneRes.body[key]).not.toEqual(createRes2[key]);
    });
  });

  it('can update a product', async () => {
    const editObj = {
      category_id: 'uber_weapons',
      price: 333,
      weight: 42.5,
      quantity_in_stock: 3,
    };

    const createRes = await agent.post(`/api/v1/products/`).send(testObj1);
    const updateRes = await agent
      .put(`/api/v1/products/${createRes.body._id}`)
      .send(editObj);

    expect(updateRes.statusCode).toBe(200);
    Object.keys(editObj).forEach(key => {
      expect(updateRes.body[key]).toEqual(editObj[key]);
    });
  });

  it('can delete a product', async () => {
    const createRes = await products.schema(testObj1).save();
    const deleteRes = await agent.delete(`/api/v1/products/${createRes._id}`);
    expect(deleteRes.statusCode).toBe(204);
    const getOneRes = await agent.get(`/api/v1/products/${createRes._id}`);
    expect(getOneRes.body).toEqual(null);
  });
});
