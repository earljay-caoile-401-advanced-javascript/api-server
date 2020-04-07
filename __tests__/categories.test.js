'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../lib/server.js');
const agent = supergoose(server.apiServer);
const categories = require('../lib/models/categories/categories-collection.js');
console.log = jest.fn();
console.error = jest.fn();

describe('API routes for categories', () => {
  const testObj1 = {
    name: 'mythical_weapons',
    display_name: 'mythical weapons',
    description: 'smite thee!',
  };

  const testObj2 = {
    name: 'household_goods',
    display_name: 'household goods',
    description: 'stuff fo yo crib!',
  };

  beforeEach(async () => {
    jest.spyOn(global.console, 'log');
    await categories.schema.deleteMany({}).exec();
  });

  it('can post a category', async () => {
    const createRes = await agent.post('/api/v1/categories').send(testObj1);
    expect(createRes.statusCode).toBe(200);
    expect(!!createRes.body._id).toEqual(true);
    Object.keys(testObj1).forEach((key) => {
      expect(testObj1[key]).toEqual(createRes.body[key]);
    });
  });

  it('can get all categories', async () => {
    await categories.schema(testObj1).save();
    await categories.schema(testObj2).save();
    let memDb = [testObj1, testObj2];

    const getRes = await agent.get('/api/v1/categories');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.count).toBe(2);

    for (let i in getRes.body.results) {
      Object.keys(testObj1).forEach((key) => {
        expect(memDb[i][key]).toEqual(getRes.body.results[i][key]);
      });
    }
  });

  it('can get all categories and filter with a query', async () => {
    const createObj1 = await categories.schema(testObj1).save();
    await categories.schema(testObj2).save();
    jest.spyOn(Array.prototype, 'filter');

    const getRes = await agent.get(`/api/v1/categories?name=${testObj1.name}`);
    const getBodyRes = getRes.body.results;
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.count).toBe(1);
    expect(Array.prototype.filter).toHaveBeenCalled();

    for (let i in getBodyRes) {
      Object.keys(testObj1).forEach((key) => {
        expect(createObj1[key]).toEqual(getBodyRes[i][key]);
      });
    }
  });

  it('can get one category', async () => {
    const createRes1 = await categories.schema(testObj1).save();
    const createRes2 = await categories.schema(testObj2).save();
    const getOneRes = await agent.get(`/api/v1/categories/${createRes1._id}`);

    expect(getOneRes.statusCode).toBe(200);
    expect(getOneRes.body._id.toString()).toBe(createRes1._id.toString());

    Object.keys(testObj1).forEach((key) => {
      expect(getOneRes.body[key]).toEqual(createRes1[key]);
    });

    Object.keys(testObj1).forEach((key) => {
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
    Object.keys(editObj).forEach((key) => {
      expect(updateRes.body[key]).toEqual(editObj[key]);
    });
  });

  it('can delete a category', async () => {
    const createRes = await categories.schema(testObj1).save();
    const deleteRes = await agent.delete(`/api/v1/categories/${createRes._id}`);
    expect(deleteRes.statusCode).toBe(200);
    const getOneRes = await agent.get(`/api/v1/categories/${createRes._id}`);
    expect(getOneRes.body).toEqual(null);
  });
});

describe('API error routes for categories', () => {
  let badObj = {
    name: false,
    badProp: 12341234,
    description: 'BLOW UP YOUR API!',
    someOtherProp: true,
  };

  beforeEach(async () => {
    jest.spyOn(global.console, 'error');
    categories.database = [];
  });

  it('can catch a post error and console error it', async () => {
    const createRes = await agent.post('/api/v1/categories').send(badObj);
    expect(console.error).toHaveBeenCalled();
    expect(createRes.statusCode).toEqual(500);
  });

  it('can catch a get all error and console error it', async () => {
    categories.get = jest.fn(async () => {
      throw 'dummy error';
    });
    const getRes = await agent.get('/api/v1/categories');
    expect(console.error).toHaveBeenCalled();
    expect(getRes.statusCode).toEqual(500);
    expect(getRes.body.error).toEqual('dummy error');
  });

  it('can catch a get one error and console error it', async () => {
    categories.get = jest.fn(async () => {
      throw 'dummy error';
    });
    const getOneRes = await agent.get(
      `/api/v1/categories/360noscope420blazeit!!!111`,
    );
    expect(getOneRes.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(getOneRes.body.error).toEqual('dummy error');
  });

  it('can catch an update error and console error it', async () => {
    const createRes = await agent.post('/api/v1/categories').send(badObj);
    const updateRes = await agent
      .put(`/api/v1/categories/${createRes._id}`)
      .send(badObj);
    expect(updateRes.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
  });

  it('can catch a delete error and console error it', async () => {
    categories.delete = jest.fn(async () => {
      throw 'dummy error';
    });
    const createRes = await agent.post('/api/v1/categories').send(badObj);
    const deleteRes = await agent.delete(`/api/v1/categories/${createRes._id}`);
    expect(deleteRes.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
  });
});
