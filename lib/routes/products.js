'use strict';

const express = require('express');
const router = express.Router();
const products = require('../models/products/products-collection.js');

router.get('/api/v1/products', getAllProducts);
router.get('/api/v1/products/:id', getOneProduct);
router.post('/api/v1/products', createProduct);
router.put('/api/v1/products/:id', updateProduct);
router.delete('/api/v1/products/:id', deleteProduct);

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
