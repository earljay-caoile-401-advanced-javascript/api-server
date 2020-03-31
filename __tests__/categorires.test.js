'use strict';

const supergoose = require('@code-fellows/supergoose');

const server = require('../lib/server.js');

const agent = supergoose(server.apiServer);
const categories = require('../lib/models/categories/categories.js');
const uuid = require('uuid').v4;

console.log = jest.fn();
console.error = jest.fn();

describe('API routes for categories', () => {
  let testObj1;
  let testObj2;

  beforeEach(() => {
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

    categories.database = [];
  });

  it('can post a category', () => {
    return agent
      .post('/api/v1/categories')
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

  it('can get all categories', () => {
    testObj1.id = uuid();
    categories.database.push(testObj1);
    testObj2.id = uuid();
    categories.database.push(testObj2);

    return agent
      .get('/api/v1/categories')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(2);
        for (let index in response.body.results) {
          Object.keys(testObj1).forEach(key => {
            expect(categories.database[index][key]).toEqual(
              response.body.results[index][key],
            );
          });
        }
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get one category', () => {
    testObj1.id = uuid();
    categories.database.push(testObj1);

    return agent
      .get(`/api/v1/categories/${testObj1.id}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        Object.keys(testObj1).forEach(key => {
          expect(categories.database[key]).toEqual(response.body[key]);
        });
      })
      .catch(error => expect(error).not.toBeDefined());
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
      .then(response => {
        expect(response.statusCode).toBe(200);
        Object.keys(editObj).forEach(key => {
          expect(response.body[key]).toEqual(editObj[key]);
        });
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can delete a category', () => {
    testObj1.id = uuid();
    categories.database.push(testObj1);
    return agent
      .delete(`/api/v1/categories/${testObj1.id}`)
      .then(response => {
        expect(response.statusCode).toBe(204);
      })
      .catch(error => expect(error).not.toBeDefined());
  });
});

describe('API error routes for categories', () => {
  let badObj = {
    name: false,
    badProp: 12341234,
    description: 'BLOW UP YOUR API!',
    someOtherProp: true,
  };

  let testObj1 = {
    name: 'mythical_weapons',
    display_name: 'mythical weapons',
    description: 'smite thee!',
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
    const createRes = await agent.get('/api/v1/categories');
    expect(console.error).toHaveBeenCalled();
    expect(createRes.statusCode).toEqual(500);
    expect(createRes.body.error).toEqual('dummy error');
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
    categories.update = jest.fn(async () => {
      throw 'dummy error';
    });
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
