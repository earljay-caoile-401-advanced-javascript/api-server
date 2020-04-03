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
      console.error('error: failed to get all');
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
      console.error('error: failed to get one');
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
      res.status(200).json(createdRecord);
    })
    .catch(error => {
      console.error('error: failed to create');
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
      console.error('error: failed to update');
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
      console.error('error: failed to delete');
      next(error);
    });
}

module.exports = router;
