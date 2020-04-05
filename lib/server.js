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
const expressSwagger = require('express-swagger-generator')(app);

let options = {
  swaggerDefinition: {
    info: {
      description: 'This is a sample server',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: process.env.HOST || 'cf-js-401-api-server.herokuapp.com',
    basePath: '/api/v1',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['server.js'], //Path to the API handle folder
};
expressSwagger(options);

// dummy route to display on homepage
app.get('/', (req, res) => res.send('API is up! Hooray!'));

app.get('/api/v1/categories', getAllCategories);
app.get('/api/v1/categories/:id', getOneCategory);
app.post('/api/v1/categories', mockAuth, createCategory);
app.put('/api/v1/categories/:id', mockAuth, updateCategory);
app.delete('/api/v1/categories/:id', mockAuth, deleteCategory);

/**
 * fetches an array of category objects along with the count of objects
 * @route GET /categories
 * @returns {object} 200 - An object containing an array of categories and the array count
 * @returns {Error} 500 - Unexpected error
 */
function getAllCategories(req, res, next) {
  categories
    .get()
    .then((results) => {
      if (req.query) {
        results = results.filter((cat) =>
          Object.keys(req.query).every((key) => cat[key] === req.query[key]),
        );
      }
      let output = {
        count: results.length,
        results,
      };
      res.status(200).json(output);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
}

/**
 * fetches an individual category object by searching for its ID
 * @route GET /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to get
 * @returns {object} 200 - the added category object
 * @returns {Error} 500 - Unexpected error
 */
function getOneCategory(req, res, next) {
  categories
    .get(req.params.id)
    .then((record) => {
      res.status(200).json(record);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
}

/**
 * creates an individual category object and adds it to the categories database
 * @route POST /categories
 * @param {object} Categories.required - category object to add to the database
 * @returns {object} 201 - the added category object
 * @returns {Error} 500 - Unexpected error
 */
function createCategory(req, res, next) {
  let record = req.body;
  categories
    .create(record)
    .then((createdRecord) => {
      res.status(201).json(createdRecord);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
}

/**
 * updates an existing category object in the database with the properties in the input object
 * @route PUT /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to update
 * @param {object} Categories.required - object with properties to update existing product with
 * @returns {object} 200 - the updated category object
 * @returns {Error} 500 - Unexpected error
 */
function updateCategory(req, res, next) {
  categories
    .update(req.params.id, req.body)
    .then((updatedRecord) => {
      res.status(200).json(updatedRecord);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
}

/**
 * deletes an existing category object in the database
 * @route DELETE /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to delete
 * @returns {object} 200 - the deleted category object
 * @returns {Error} 500 - Unexpected error
 */
function deleteCategory(req, res, next) {
  categories
    .delete(req.params.id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
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
 * fetches an array of product objects along with the count of objects
 * @route GET /products
 * @returns {object} 200 - an object containing an array of products and the array count
 * @returns {Error} 500 - Unexpected error
 */
function getAllProducts(req, res, next) {
  products
    .get()
    .then((results) => {
      if (req.query) {
        results = results.filter((prod) =>
          Object.keys(req.query).every((key) => prod[key] === req.query[key]),
        );
      }
      let output = {
        count: results.length,
        results,
      };
      res.status(200).json(output);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
}

/**
 * fetches an individual product object by searching for its ID
 * @route GET /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to get
 * @returns {object} 200 - the added product object
 * @returns {Error} 500 - Unexpected error
 */
function getOneProduct(req, res, next) {
  products
    .get(req.params.id)
    .then((record) => {
      res.status(200).json(record);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
}

/**
 * creates an individual product object and adds it to the products database
 * @route POST /products
 * @param {object} Products.required - product object to add to the database
 * @returns {object} 201 - the added category object
 * @returns {Error} 500 - Unexpected error
 */
function createProduct(req, res, next) {
  let record = req.body;
  products
    .create(record)
    .then((createdRecord) => {
      res.status(201).json(createdRecord);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
}

/**
 * updates an existing product object in the database with the properties in the input object
 * @route PUT /products/{id}
 * @param {string} id.path.required - the ID property of the individual category to update
 * @param {object} Products.required - object with properties to update existing product with
 * @returns {object} 200 - the updated category object
 * @returns {Error} 500 - Unexpected error
 */
function updateProduct(req, res, next) {
  products
    .update(req.params.id, req.body)
    .then((updatedRecord) => {
      res.status(200).json(updatedRecord);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
}

/**
 * deletes an existing product object in the database
 * @route DELETE /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to delete
 * @returns {object} 200 - the deleted product object
 * @returns {Error} 500 - Unexpected error
 */
function deleteProduct(req, res, next) {
  products
    .delete(req.params.id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
}

// error handling (unsupported routes)
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  apiServer: app,
  start: (port) => {
    app.listen(port, () => console.log('running on', port));
  },
};
