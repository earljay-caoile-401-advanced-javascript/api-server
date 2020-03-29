'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../lib/server.js');
const agent = supergoose(server.apiServer);
const products = require('../lib/models/products/products-collection.js');

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

    jest.spyOn(global.console, 'log');
    console.log = jest.fn();
    console.error = jest.fn();

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

describe('API error routes for products', () => {
  let testObj1 = {
    category_id: 'mythical_weapons',
    price: 9999,
    weight: 42.3,
    quantity_in_stock: 1,
  };

  let badObj = {
    category_id: 22341234,
    price: true,
    weight: '234',
  };

  beforeEach(async () => {
    jest.spyOn(global.console, 'error');
  });

  afterEach(async () => {
    await products.schema.deleteMany({}).exec();
  });

  it('can catch a post error and console error it', async () => {
    jest.spyOn(global.console, 'error');
    await agent.post('/api/v1/products').send(badObj);
    expect(console.error).toHaveBeenCalled();
  });

  it('can catch a get all error and console error it', async () => {
    products.get = jest.fn(async () => {
      throw 'dummy error';
    });
    const createRes = await agent.get('/api/v1/products');
    expect(console.error).toHaveBeenCalled();
    expect(createRes.statusCode).toEqual(500);
    expect(createRes.body.error).toEqual('dummy error');
  });

  it('can catch a get one error and console error it', async () => {
    products.get = jest.fn(async () => {
      throw 'dummy error';
    });
    const getOneRes = await agent.get(
      `/api/v1/products/360noscope420blazeit!!!111`,
    );
    expect(getOneRes.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(getOneRes.body.error).toEqual('dummy error');
  });

  it('can catch an update error and console error it', async () => {
    products.update = jest.fn(async () => {
      throw 'dummy error';
    });
    const createRes = await products.schema(testObj1).save();
    const updateRes = await agent
      .put(`/api/v1/products/${createRes._id}`)
      .send(badObj);
    expect(updateRes.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
  });

  it('can catch a delete error and console error it', async () => {
    products.delete = jest.fn(async () => {
      throw 'dummy error';
    });
    const createRes = await products.schema(testObj1).save();
    const deleteRes = await agent.delete(`/api/v1/products/${createRes._id}`);
    expect(deleteRes.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
  });
});
