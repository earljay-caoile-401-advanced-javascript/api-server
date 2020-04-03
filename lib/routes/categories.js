'use strict';

const express = require('express');
const router = express.Router();
const categories = require('../models/categories/categories-collection.js');

router.get('/api/v1/categories', getAllCategories);
router.get('/api/v1/categories/:id', getOneCategory);
router.post('/api/v1/categories', createCategory);
router.put('/api/v1/categories/:id', updateCategory);
router.delete('/api/v1/categories/:id', deleteCategory);

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
      console.error('error: failed to get all');
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
      console.error('error: failed to get one category');
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
      res.status(200).json(createdRecord);
    })
    .catch(error => {
      console.error('error: failed to create');
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
      console.error('error: failed to update');
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
      console.error('error: failed to delete');
      next(error);
    });
}

module.exports = router;
