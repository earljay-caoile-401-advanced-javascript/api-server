'use strict';

const supergoose = require('@code-fellows/supergoose');

const server = require('../lib/server.js');

const agent = supergoose(server.apiServer);
const products = require('../lib/models/products.js');
const uuid = require('uuid').v4;

console.log = jest.fn();
console.error = jest.fn();

describe('API routes for products', () => {
  const testObj1 = {
    category: 'mythical_weapons',
    name: 'mjolnir',
    display_name: 'Mjolnir',
    description:
      "Thor's hammer. It can only be wielded by those who are worthy!",
  };

  const testObj2 = {
    category: 'mythical_weapons',
    name: 'gungnir',
    display_name: 'Gungnir',
    description: "Odin's spear. It supposedly doesn't miss...",
  };

  const testObj3 = {
    category: 'health_house_baby',
    name: 'adhesive_medical_strips',
    display_name: 'Adhesive Medical Strips',
    description:
      "We can't use band-aid since that's a copyrighted compoany name, but that's pretty much what it is...",
  };

  beforeEach(() => {
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
    testObj3.id = uuid();
    products.database.push(testObj3);

    return agent
      .get('/api/v1/products')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(3);
        for (let i in response.body.results) {
          Object.keys(testObj1).forEach(key => {
            expect(products.database[i][key]).toEqual(
              response.body.results[i][key],
            );
          });
        }
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get all products and filter with a query', () => {
    testObj1.id = uuid();
    products.database.push(testObj1);
    testObj2.id = uuid();
    products.database.push(testObj2);

    return agent
      .get(`/api/v1/products?category=${testObj1.category}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(2);
        for (let i in response.body.results) {
          Object.keys(testObj1).forEach(key => {
            expect(products.database[i][key]).toEqual(
              response.body.results[i][key],
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
        const dbFilter = products.database.filter(
          record => record.id === testObj1.id,
        );

        expect(response.body).toEqual(dbFilter);
        Object.keys(testObj1).forEach(key => {
          expect(products.database[key]).toEqual(response.body[key]);
          expect(response.body[key]).toEqual(dbFilter[key]);
          expect(products.database[key]).toEqual(dbFilter[key]);
        });
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can update a product', () => {
    testObj1.id = uuid();
    products.database.push(testObj1);
    const editObj = {
      category: 'mythical_weapons_edited',
      name: 'mjolnir_edited',
      display_name: 'Mjolnir!!!!!!!!!oneoneone',
      description: 'Edited the description! You are not worthy!',
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

describe('API error routes for products', () => {
  let testObj1 = {
    category: 'mythical_weapons',
    name: 'mjolnir',
    display_name: 'Mjolnir',
    description:
      "Thor's hammer. It can only be wielded by those who are worthy!",
  };

  let badObj = {
    category_id: 22341234,
    price: true,
    weight: '234',
  };

  beforeEach(async () => {
    jest.spyOn(global.console, 'error');
    products.database = [];
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
    const createRes = await agent.post('/api/v1/products').send(badObj);
    const updateRes = await agent
      .put(`/api/v1/products/${createRes._id}`)
      .send(badObj);
    expect(updateRes.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(updateRes.body.error).toEqual('Invalid object');
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
