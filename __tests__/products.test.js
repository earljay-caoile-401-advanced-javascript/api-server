'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../lib/server.js');
const agent = supergoose(server.apiServer);
const products = require('../lib/models/products/products-collection.js');
console.log = jest.fn();
console.error = jest.fn();
const sampleData = require('../data/db.json');

describe('API routes for products', () => {
  const rawObj1 = sampleData.products[0];
  const testObj1 = Object.keys(rawObj1)
    .filter((key) => key !== '_id' && key !== '__v')
    .reduce((res, key) => ((res[key] = rawObj1[key]), res), {});

  const rawObj2 = sampleData.products[1];
  const testObj2 = Object.keys(rawObj2)
    .filter((key) => key !== '_id' && key !== '__v')
    .reduce((res, key) => ((res[key] = rawObj2[key]), res), {});
  const rawObj3 = sampleData.products[2];
  const testObj3 = Object.keys(rawObj3)
    .filter((key) => key !== '_id' && key !== '__v')
    .reduce((res, key) => ((res[key] = rawObj3[key]), res), {});

  beforeEach(async () => {
    jest.spyOn(global.console, 'log');
    await products.schema.deleteMany({}).exec();
  });

  it('can post a product', async () => {
    const createRes = await agent.post('/api/v1/products').send(testObj1);
    expect(createRes.statusCode).toBe(200);
    expect(!!createRes.body._id).toEqual(true);
    Object.keys(testObj1).forEach((key) => {
      expect(testObj1[key]).toEqual(createRes.body[key]);
    });
  });

  it('can get all products', async () => {
    await products.schema(testObj1).save();
    await products.schema(testObj2).save();
    let memDb = [testObj1, testObj2];

    const getRes = await agent.get('/api/v1/products');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.count).toBe(2);

    for (let i in getRes.body.results) {
      Object.keys(testObj1).forEach((key) => {
        expect(memDb[i][key]).toEqual(getRes.body.results[i][key]);
      });
    }
  });

  it('can get all products and filter with a query', async () => {
    const createObj1 = await products.schema(testObj1).save();
    await products.schema(testObj2).save();
    await products.schema(testObj3).save();
    jest.spyOn(Array.prototype, 'filter');

    const getRes = await agent.get(`/api/v1/products?name=${testObj1.name}`);
    const getBodyRes = getRes.body.results;
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.count).toBe(1);
    expect(Array.prototype.filter).toHaveBeenCalled();

    for (let i in getBodyRes) {
      Object.keys(testObj1).forEach((key) => {
        expect(createObj1[key]).toBe(getBodyRes[i][key]);
      });
    }
  });

  it('can get one product', async () => {
    const createRes1 = await products.schema(testObj1).save();
    await products.schema(testObj2).save();
    const getOneRes = await agent.get(`/api/v1/products/${createRes1._id}`);

    expect(getOneRes.statusCode).toBe(200);
    expect(getOneRes.body._id.toString()).toBe(createRes1._id.toString());

    Object.keys(testObj1).forEach((key) => {
      expect(getOneRes.body[key]).toBe(createRes1[key]);
    });
  });

  it('can update a product', async () => {
    const editObj = {
      name: 'uber_weapons',
      displayName: 'uber weapons',
      description: 'cool beans',
    };

    const createRes = await agent.post(`/api/v1/products/`).send(testObj1);
    const updateRes = await agent
      .put(`/api/v1/products/${createRes.body._id}`)
      .send(editObj);

    expect(updateRes.statusCode).toBe(200);
    Object.keys(editObj).forEach((key) => {
      expect(updateRes.body[key]).toEqual(editObj[key]);
    });
  });

  it('can delete a product', async () => {
    const createRes = await products.schema(testObj1).save();
    const deleteRes = await agent.delete(`/api/v1/products/${createRes._id}`);
    expect(deleteRes.statusCode).toBe(200);
    const getOneRes = await agent.get(`/api/v1/products/${createRes._id}`);
    expect(getOneRes.body).toEqual(null);
  });
});

describe('API error routes for products', () => {
  let badObj = {
    category_id: 22341234,
    price: true,
    weight: '234',
  };

  beforeEach(async () => {
    jest.spyOn(global.console, 'error');
  });

  it('can catch a post error and console error it', async () => {
    jest.spyOn(global.console, 'error');
    const createRes = await agent.post('/api/v1/products').send(badObj);
    expect(createRes.statusCode).toEqual(500);
    expect(console.error).toHaveBeenCalled();
  });

  it('can catch a get all error and console error it', async () => {
    products.get = jest.fn(async () => {
      throw 'dummy error';
    });
    const getRes = await agent.get('/api/v1/products');
    expect(console.error).toHaveBeenCalled();
    expect(getRes.statusCode).toEqual(500);
    expect(getRes.body.error).toEqual('dummy error');
  });

  it('can catch a get one error and console error it', async () => {
    products.get = jest.fn(async () => {
      throw 'dummy error';
    });

    /*eslint-disable comma-dangle*/
    const getOneRes = await agent.get(
      `/api/v1/products/360noscope420blazeit!!!111`
    );
    /*eslint-disable quotes*/
    expect(getOneRes.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(getOneRes.body.error).toEqual('dummy error');
  });

  it('can catch an update error and console error it', async () => {
    const createRes = await agent.post('/api/v1/products').send(badObj);
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
    const createRes = await agent.post('/api/v1/products').send(badObj);
    const deleteRes = await agent.delete(`/api/v1/products/${createRes._id}`);
    expect(deleteRes.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
  });
});
