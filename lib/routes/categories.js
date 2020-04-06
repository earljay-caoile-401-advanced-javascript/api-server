'use strict';

const express = require('express');
const router = express.Router();
const categories = require('../models/categories/categories-collection.js');

router.get('/api/v1/categories', getAllCategories);
router.get('/api/v1/categories/:id', getOneCategory);
router.post('/api/v1/categories', createCategory);
router.put('/api/v1/categories/:id', updateCategory);
router.delete('/api/v1/categories/:id', deleteCategory);

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
      console.error('error: failed to get all');
      next(error);
    });
}

function getOneCategory(req, res, next) {
  categories
    .get(req.params.id)
    .then((record) => {
      res.status(200).json(record);
    })
    .catch((error) => {
      console.error('error: failed to get one category');
      next(error);
    });
}

function createCategory(req, res, next) {
  let record = req.body;
  categories
    .create(record)
    .then((createdRecord) => {
      res.status(200).json(createdRecord);
    })
    .catch((error) => {
      console.error('error: failed to create');
      next(error);
    });
}

function updateCategory(req, res, next) {
  categories
    .update(req.params.id, req.body)
    .then((updatedRecord) => {
      res.status(200).json(updatedRecord);
    })
    .catch((error) => {
      console.error('error: failed to update');
      next(error);
    });
}

function deleteCategory(req, res, next) {
  categories
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
