'use strict';

/**
 * loads express-swagger-generator with the appropriate options to generate a Swagger page for the API server
 * @param {object} app - express app instance
 * @returns (void)
 */
module.exports = (app) => {
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
            name: { type: 'string' },
            display_name: { type: 'string' },
            description: { type: 'string' },
          },
          example: {
            name: sampleData.categories[0].name,
            display_name: sampleData.categories[0].display_name,
            description: sampleData.categories[0].description,
          },
          required: ['id', 'name'],
        },
        category_response: {
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            display_name: { type: 'string' },
            description: { type: 'string' },
            __v: { type: 'number' },
          },
          example: sampleData.categories[0],
          required: ['id', 'name'],
        },
        categories: {
          properties: {
            count: { type: 'number' },
            results: {
              type: 'array',
              items: {
                $ref: '#/definitions/category_response',
              },
            },
          },
          example: {
            count: sampleData.categories.length,
            results: sampleData.categories,
          },
          required: ['count', 'results'],
        },
        product_request: {
          properties: {
            category: { type: 'string' },
            name: { type: 'string' },
            display_name: { type: 'string' },
            description: { type: 'string' },
          },
          example: {
            category: sampleData.products[0].category,
            name: sampleData.products[0].name,
            display_name: sampleData.products[0].display_name,
            description: sampleData.products[0].description,
          },
          required: ['category', 'name'],
        },
        product_response: {
          properties: {
            id: { type: 'string' },
            category: { type: 'string' },
            name: { type: 'string' },
            display_name: { type: 'string' },
            description: { type: 'string' },
            __v: { type: 'number' },
          },
          example: sampleData.products[0],
          required: ['id', 'category', 'name'],
        },
        products: {
          properties: {
            count: { type: 'number' },
            results: {
              type: 'array',
              items: {
                $ref: '#/definitions/product_response',
              },
            },
          },
          example: {
            count: sampleData.products.length,
            results: sampleData.products,
          },
          required: ['count', 'results'],
        },
      },
    },
    basedir: __dirname, //app absolute path
    files: ['../lib/routes/***.js'], //Path to the API handle folder
  };
  expressSwagger(options);
};
