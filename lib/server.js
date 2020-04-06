'use strict';

// 3rd party dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// dependencies we made
const notFoundHandler = require('./middleware/404.js');
const errorHandler = require('./middleware/500.js');

const categoriesRoutes = require('./routes/categories.js');
const productsRoutes = require('./routes/products.js');
const timestamp = require('./middleware/timestamp.js');
const logger = require('./middleware/logger.js');

const app = express();
const expressSwagger = require('express-swagger-generator')(app);

const sampleData = require('../data/db.json');
const options = {
  swaggerDefinition: {
    info: {
      description: 'This is a sample server',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: process.env.HOST || 'cf-js-401-api-server.herokuapp.com',
    basePath: '/api/v1',
    produces: ['application/json', 'application/xml'],
    schemes:
      process.env.HOST && process.env.HOST.includes('localhost')
        ? ['http']
        : ['https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
    definitions: {
      category_request: {
        properties: {
          name: { type: 'string', example: 'mythical_weapons' },
          display_name: {
            type: 'string',
            example: 'Mythical Weapons',
          },
          description: {
            type: 'string',
            example: 'I shall smite thee!',
          },
        },
        required: ['id', 'name'],
      },
      category_response: {
        properties: {
          id: {
            type: 'string',
            example: '923c0ed5-d53d-4b1d-a08a-efa6ee6d0f8f',
          },
          name: { type: 'string', example: 'mythical_weapons' },
          display_name: {
            type: 'string',
            example: 'Mythical Weapons',
          },
          description: {
            type: 'string',
            example: 'I shall smite thee!',
          },
        },
        required: ['id', 'name'],
      },
      categories: {
        properties: {
          count: {
            type: 'number',
            example: sampleData.categories.length,
          },
          results: {
            type: 'array',
            example: sampleData.categories,
          },
        },
        required: ['count', 'results'],
        items: {
          type: 'object',
        },
      },
      product_request: {
        properties: {
          category: {
            type: 'string',
            example: 'mythical_weapons',
          },
          name: { type: 'string', example: 'mjolnir' },
          display_name: { type: 'string', example: 'Mjolnir' },
          description: {
            type: 'string',
            example:
              "Thor's hammer. It can only be wielded by those who are worthy!",
          },
        },
        required: ['category', 'name'],
      },
      product_response: {
        properties: {
          id: {
            type: 'string',
            example: 'fdda60f9-11ce-430c-a35c-838817ad1496',
          },
          category: {
            type: 'string',
            example: 'mythical_weapons',
          },
          name: { type: 'string', example: 'mjolnir' },
          display_name: { type: 'string', example: 'Mjolnir' },
          description: {
            type: 'string',
            example:
              "Thor's hammer. It can only be wielded by those who are worthy!",
          },
        },
        required: ['id', 'category', 'name'],
      },
      products: {
        properties: {
          count: {
            type: 'number',
            example: sampleData.products.length,
          },
          results: {
            type: 'array',
            example: sampleData.products,
          },
        },
        required: ['count', 'results'],
        items: {
          type: 'object',
        },
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['server.js'], //Path to the API handle folder
};
expressSwagger(options);

// 3rd party global middleware
app.use(cors());
app.use(morgan('dev'));

// own middleware
app.use(express.json());
app.use(timestamp);
app.use(logger);

// dummy route to display on homepage
app.get('/', (req, res) => res.send('API is up! Hooray!'));

/**
 * fetches an array of category objects along with the count of objects
 * @route GET /categories
 * @param {string} name.query - categories matching the given name
 * @param {string} display_name.query - categories matching the given display_name
 * @param {string} description.query - categories matching the given description
 * @returns {categories.model} 200 - An object containing an array of categories and the array count
 * @returns {Error} 500 - Unexpected error
 */

/**
 * fetches an individual category object by searching for its ID
 * @route GET /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to get
 * @returns {category_response.model} 200 - the matching category object
 * @returns {Error} 500 - Unexpected error
 */

/**
 * creates an individual category object and adds it to the categories database
 * @route POST /categories
 * @param {category_request.model} category.body.required - the new category
 * @returns {category_response.model} 201 - the created category object
 * @returns {Error}  default - Unexpected error
 */

/**
 * updates an existing category object in the database with the properties in the input object
 * @route PUT /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to update - eg: 1
 * @param {category_request.model} category.body.required - object with properties to update existing category with
 * @returns {category_response.model} 200 - the updated category object
 * @returns {Error} 500 - ID not found
 */

/**
 * deletes an existing category object in the database
 * @route DELETE /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to delete
 * @returns {category_response.model} 200 - the deleted category object
 * @returns {Error} 500 - ID not found
 */
app.use(categoriesRoutes);

/**
 * fetches an array of product objects along with the count of objects
 * @route GET /products
 * @param {string} name.query - products matching the given name
 * @param {string} category.query - products matching the given category
 * @param {string} display_name.query - products matching the given display_name
 * @param {string} description.query - products matching the given description
 * @returns {products.model} 200 - An object containing an array of products and the array count
 * @returns {Error} 500 - Unexpected error
 */

/**
 * fetches an individual product object by searching for its ID
 * @route GET /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to get
 * @returns {product_response.model} 200 - the matching product object
 * @returns {Error} 500 - Unexpected error
 */

/**
 * creates an individual product object and adds it to the products database
 * @route POST /products
 * @param {product_request.model} product.body.required - the new category
 * @returns {product_response.model} 201 - the created product object
 * @returns {Error}  default - Unexpected error
 */

/**
 * updates an existing product object in the database with the properties in the input object
 * @route PUT /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to update - eg: 1
 * @param {product_request.model} product.body.required - object with properties to update existing product with
 * @returns {product_response.model} 200 - the updated product object
 * @returns {Error} 500 - ID not found
 */

/**
 * deletes an existing category object in the database
 * @route DELETE /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to delete
 * @returns {product_response.model} 200 - the deleted product object
 * @returns {Error} 500 - ID not found
 */
app.use(productsRoutes);

// error handling (unsupported routes)
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  apiServer: app,
  start: (port) => {
    app.listen(port, () => console.log('running on', port));
  },
};
