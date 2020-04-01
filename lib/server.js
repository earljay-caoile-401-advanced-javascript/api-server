'use strict';

// 3rd party dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// dependencies we made
const notFoundHandler = require('./middleware/404.js');
const errorHandler = require('./middleware/500.js');
const categories = require('../lib/models/categories/categories.js');
const products = require('../lib/models/products/products.js');
const timestamp = require('./middleware/timestamp.js');
const logger = require('./middleware/logger.js');
const mockAuth = require('./middleware/mock-auth.js');
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

app.get('/api/v1/categories', getAllCategories);
app.get('/api/v1/categories/:id', getOneCategory);
app.post('/api/v1/categories', mockAuth, createCategory);
app.put('/api/v1/categories/:id', mockAuth, updateCategory);
app.delete('/api/v1/categories/:id', mockAuth, deleteCategory);

function getAllCategories(req, res, next) {
  categories
    .get()
    .then(results => {
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

function createCategory(req, res, next) {
  let record = req.body;
  categories
    .create(record)
    .then(createdRecord => {
      res.status(200).json(createdRecord);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

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

function getAllProducts(req, res, next) {
  products
    .get()
    .then(results => {
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

function createProduct(req, res, next) {
  let record = req.body;
  products
    .create(record)
    .then(createdRecord => {
      res.status(200).json(createdRecord);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
}

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
