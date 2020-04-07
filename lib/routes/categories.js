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
 * fetches an array of category objects along with the count of objects
 * @route GET /categories
 * @param {string} name.query - categories matching the given name
 * @param {string} display_name.query - categories matching the given display_name
 * @param {string} description.query - categories matching the given description
 * @returns {categories.model} 200 - An object containing an array of categories and the array count
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
      console.error('error: failed to get all');
      next(error);
    });
}

/**
 * fetches an individual category object by searching for its ID
 * @route GET /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to get
 * @returns {category_response.model} 200 - the matching category object
 * @returns {Error} 500 - Unexpected error
 */
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

/**
 * creates an individual category object and adds it to the categories database
 * @route POST /categories
 * @param {category_request.model} category.body.required - the new category
 * @returns {category_response.model} 201 - the created category object
 * @returns {Error}  default - Unexpected error
 */
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

/**
 * updates an existing category object in the database with the properties in the input object
 * @route PUT /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to update - eg: 1
 * @param {category_request.model} category.body.required - object with properties to update existing category with
 * @returns {category_response.model} 200 - the updated category object
 * @returns {Error} 500 - ID not found
 */
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

/**
 * deletes an existing category object in the database
 * @route DELETE /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to delete
 * @returns {category_response.model} 200 - the deleted category object
 * @returns {Error} 500 - ID not found
 */
function deleteCategory(req, res, next) {
  categories
    .delete(req.params.id)
    .then((deletedRecord) => {
      res.status(200).send(deletedRecord);
    })
    .catch((error) => {
      console.error('error: failed to delete');
      next(error);
    });
}

module.exports = router;
