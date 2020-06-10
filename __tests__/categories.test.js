'use strict';

const supergoose = require('@code-fellows/supergoose');

const server = require('../lib/server.js');

const agent = supergoose(server.apiServer);
const categories = require('../lib/models/categories.js');
const uuid = require('uuid').v4;

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

  beforeEach(() => {
    categories.database = [];
  });

  it('can post a category', () => {
    return agent
      .post('/api/v1/categories')
      .send(testObj1)
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(!!response.body.id).toEqual(true);
        Object.keys(testObj1).forEach((key) => {
          expect(testObj1[key]).toEqual(response.body[key]);
        });
      })
      .catch((error) => expect(error).not.toBeDefined());
  });

  it('can get all categories', () => {
    testObj1.id = uuid();
    categories.database.push(testObj1);
    testObj2.id = uuid();
    categories.database.push(testObj2);

    return agent
      .get('/api/v1/categories')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(2);
        for (let i in response.body.results) {
          Object.keys(testObj1).forEach((key) => {
            expect(categories.database[i][key]).toEqual(
              response.body.results[i][key],
            );
          });
        }
      })
      .catch((error) => expect(error).not.toBeDefined());
  });

  it('can get all categories and filter with a query', () => {
    testObj1.id = uuid();
    categories.database.push(testObj1);
    testObj2.id = uuid();
    categories.database.push(testObj2);

    return agent
      .get(`/api/v1/categories?name=${testObj1.name}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(1);
        for (let i in response.body.results) {
          Object.keys(testObj1).forEach((key) => {
            expect(categories.database[i][key]).toEqual(
              response.body.results[i][key],
            );
          });
        }
      })
      .catch((error) => expect(error).not.toBeDefined());
  });

  it('can get one category', () => {
    testObj1.id = uuid();
    categories.database.push(testObj1);

    return agent
      .get(`/api/v1/categories/${testObj1.id}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        const dbFilter = categories.database.filter(
          (record) => record.id === testObj1.id,
        );

        expect(response.body).toEqual(dbFilter);
        Object.keys(testObj1).forEach((key) => {
          expect(categories.database[key]).toEqual(response.body[key]);
          expect(response.body[key]).toEqual(dbFilter[key]);
          expect(categories.database[key]).toEqual(dbFilter[key]);
        });
      })
      .catch((error) => expect(error).not.toBeDefined());
  });

  it('can update a category', () => {
    testObj1.id = uuid();
    categories.database.push(testObj1);
    const editObj = {
      name: 'uber_weapons',
      display_name: 'uber weapons',
      description: 'cool beans',
    };

    return agent
      .put(`/api/v1/categories/${testObj1.id}`)
      .send(editObj)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        Object.keys(editObj).forEach((key) => {
          expect(response.body[key]).toEqual(editObj[key]);
        });
      })
      .catch((error) => expect(error).not.toBeDefined());
  });

  it('can delete a category', () => {
    testObj1.id = uuid();
    categories.database.push(testObj1);
    return agent
      .delete(`/api/v1/categories/${testObj1.id}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
      })
      .catch((error) => expect(error).not.toBeDefined());
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
    expect(updateRes.body.error).toEqual('Invalid object');
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
