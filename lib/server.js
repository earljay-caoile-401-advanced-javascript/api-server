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
  files: ['./routes/***.js'], //Path to the API handle folder
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

app.use(categoriesRoutes);
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
