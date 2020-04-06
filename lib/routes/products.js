'use strict';

const express = require('express');
const router = express.Router();
const products = require('../models/products/products-collection.js');

router.get('/api/v1/products', getAllProducts);
router.get('/api/v1/products/:id', getOneProduct);
router.post('/api/v1/products', createProduct);
router.put('/api/v1/products/:id', updateProduct);
router.delete('/api/v1/products/:id', deleteProduct);

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
      console.error('error: failed to get all');
      next(error);
    });
}

/**
 * fetches an individual product object by searching for its ID
 * @route GET /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to get
 * @returns {product_response.model} 200 - the matching product object
 * @returns {Error} 500 - Unexpected error
 */
function getOneProduct(req, res, next) {
  products
    .get(req.params.id)
    .then((record) => {
      res.status(200).json(record);
    })
    .catch((error) => {
      console.error('error: failed to get one');
      next(error);
    });
}

/**
 * creates an individual product object and adds it to the products database
 * @route POST /products
 * @param {product_request.model} product.body.required - the new category
 * @returns {product_response.model} 201 - the created product object
 * @returns {Error}  default - Unexpected error
 */
function createProduct(req, res, next) {
  let record = req.body;
  products
    .create(record)
    .then((createdRecord) => {
      res.status(200).json(createdRecord);
    })
    .catch((error) => {
      console.error('error: failed to create');
      next(error);
    });
}

/**
 * updates an existing product object in the database with the properties in the input object
 * @route PUT /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to update - eg: 1
 * @param {product_request.model} product.body.required - object with properties to update existing product with
 * @returns {product_response.model} 200 - the updated product object
 * @returns {Error} 500 - ID not found
 */
function updateProduct(req, res, next) {
  products
    .update(req.params.id, req.body)
    .then((updatedRecord) => {
      res.status(200).json(updatedRecord);
    })
    .catch((error) => {
      console.error('error: failed to update');
      next(error);
    });
}

/**
 * deletes an existing category object in the database
 * @route DELETE /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to delete
 * @returns {product_response.model} 200 - the deleted product object
 * @returns {Error} 500 - ID not found
 */
function deleteProduct(req, res, next) {
  products
    .delete(req.params.id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.error('error: failed to delete');
      next(error);
    });
}

module.exports = router;
