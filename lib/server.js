'use strict';

// 3rd party dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// dependencies we made
const notFoundHandler = require('./middleware/404.js');
const errorHandler = require('./middleware/500.js');
const categories = require('./models/categories.js');
const products = require('./models/products.js');
const timestamp = require('./middleware/timestamp.js');
const logger = require('./middleware/logger.js');
const mockAuth = require('./middleware/mock-auth.js');

// initializes "database" with default values
const data = require('../data/db.json');
categories.database = data.categories;
products.database = data.products;

const app = express();

// 3rd party global middleware
app.use(cors());
app.use(morgan('dev'));

// own middleware
app.use(express.json());
app.use(timestamp);
app.use(logger);

// dummy route to display on homepage
app.get('/', (req, res) => res.send('Heroku deploy works! Hooray!'));

app.get('/api/v1/categories', getAllCategories);
app.get('/api/v1/categories/:id', getOneCategory);
app.post('/api/v1/categories', mockAuth, createCategory);
app.put('/api/v1/categories/:id', mockAuth, updateCategory);
app.delete('/api/v1/categories/:id', mockAuth, deleteCategory);

/**
 * fetches an array of Categories objects along with the count of objects
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function getAllCategories(req, res, next) {
  categories
    .get()
    .then(results => {
      if (req.query) {
        results = results.filter(cat =>
          Object.keys(req.query).every(key => cat[key] === req.query[key]),
        );
      }
      let output = {
        count: results.length,
        results,
      };
      res.status(200).json(output);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

/**
 * fetches an individual Categories object by searching with req.params.id
 * @param {object} req - request object (includes req.params.id for ID search)
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function getOneCategory(req, res, next) {
  categories
    .get(req.params.id)
    .then(record => {
      res.status(200).json(record);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

/**
 * creates an individual Categories object by saving the req.body object
 * @param {object} req - request object (includes req.body for creation)
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function createCategory(req, res, next) {
  let record = req.body;
  categories
    .create(record)
    .then(createdRecord => {
      res.status(201).json(createdRecord);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

/**
 * updates an existing Categories object with req.params.id and req.body
 * @param {object} req - request object (includes req.body and req.params.id for update)
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function updateCategory(req, res, next) {
  categories
    .update(req.params.id, req.body)
    .then(updatedRecord => {
      res.status(200).json(updatedRecord);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

/**
 * deletes an existing Categories object with req.params.id
 * @param {object} req - request object (includes req.params.id for delete)
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function deleteCategory(req, res, next) {
  categories
    .delete(req.params.id)
    .then(() => {
      res.status(204).send();
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

app.get('/api/v1/products', getAllProducts);
app.get('/api/v1/products/:id', getOneProduct);
app.post('/api/v1/products', mockAuth, createProduct);
app.put('/api/v1/products/:id', mockAuth, updateProduct);
app.delete('/api/v1/products/:id', mockAuth, deleteProduct);

/**
 * fetches an array of Products objects along with the count of objects
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function getAllProducts(req, res, next) {
  products
    .get()
    .then(results => {
      if (req.query) {
        results = results.filter(prod =>
          Object.keys(req.query).every(key => prod[key] === req.query[key]),
        );
      }
      let output = {
        count: results.length,
        results,
      };
      res.status(200).json(output);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

/**
 * fetches an individual Products object by searching with req.params.id
 * @param {object} req - request object (includes req.params.id for ID search)
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function getOneProduct(req, res, next) {
  products
    .get(req.params.id)
    .then(record => {
      res.status(200).json(record);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

/**
 * creates an individual Products object by saving the req.body object
 * @param {object} req - request object (includes req.body for creation)
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function createProduct(req, res, next) {
  let record = req.body;
  products
    .create(record)
    .then(createdRecord => {
      res.status(201).json(createdRecord);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

/**
 * updates an existing Products object with req.params.id and req.body
 * @param {object} req - request object (includes req.body and req.params.id for update)
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function updateProduct(req, res, next) {
  products
    .update(req.params.id, req.body)
    .then(updatedRecord => {
      res.status(200).json(updatedRecord);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

/**
 * deletes an existing Products object with req.params.id
 * @param {object} req - request object (includes req.params.id for delete)
 * @param {object} res - response object
 * @param {function} next - callback function
 */
function deleteProduct(req, res, next) {
  products
    .delete(req.params.id)
    .then(() => {
      res.status(204).send();
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

// error handling (unsupported routes)
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  apiServer: app,
  start: port => {
    app.listen(port, () => console.log('running on', port));
  },
};
