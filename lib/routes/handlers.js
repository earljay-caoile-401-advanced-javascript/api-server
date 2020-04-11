'use strict';

let handlers = {};

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
 * fetches an array of product objects along with the count of objects
 * @route GET /products
 * @param {string} name.query - products matching the given name
 * @param {string} category.query - products matching the given category
 * @param {string} display_name.query - products matching the given display_name
 * @param {string} description.query - products matching the given description
 * @returns {products.model} 200 - An object containing an array of products and the array count
 * @returns {Error} 500 - Unexpected error
 */
handlers.getAll = (req, res, next) => {
  req.model
    .get()
    .then((results) => {
      if (req.query) {
        results = results.filter((record) =>
          Object.keys(req.query).every((key) => record[key] === req.query[key]),
        );
      }
      let output = {
        count: results.length,
        results,
      };
      res.status(200).json(output);
    })
    .catch((error) => {
      console.error('error: failed to get all records');
      next(error);
    });
};

/**
 * fetches an individual category object by searching for its ID
 * @route GET /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to get
 * @returns {category_response.model} 200 - the matching category object
 * @returns {Error} 500 - Unexpected error
 */

/**
 * fetches an individual product object by searching for its ID
 * @route GET /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to get
 * @returns {product_response.model} 200 - the matching product object
 * @returns {Error} 500 - Unexpected error
 */
handlers.getOne = (req, res, next) => {
  req.model
    .get(req.params.id)
    .then((record) => {
      res.status(200).json(record);
    })
    .catch((error) => {
      console.error('error: failed to get one record');
      next(error);
    });
};

/**
 * creates an individual category object and adds it to the categories database
 * @route POST /categories
 * @param {category_request.model} category.body.required - the new category
 * @returns {category_response.model} 200 - the created category object
 * @returns {Error}  default - Unexpected error
 */

/**
 * creates an individual product object and adds it to the products database
 * @route POST /products
 * @param {product_request.model} product.body.required - the new category
 * @returns {product_response.model} 200 - the created product object
 * @returns {Error}  default - Unexpected error
 */
handlers.createRecord = (req, res, next) => {
  let record = req.body;
  req.model
    .create(record)
    .then((createdRecord) => {
      res.status(200).json(createdRecord);
    })
    .catch((error) => {
      console.error('error: failed to create');
      next(error);
    });
};

/**
 * updates an existing category object in the database with the properties in the input object
 * @route PUT /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to update - eg: 1
 * @param {category_request.model} category.body.required - object with properties to update existing category with
 * @returns {category_response.model} 200 - the updated category object
 * @returns {Error} 500 - ID not found
 */

/**
 * updates an existing product object in the database with the properties in the input object
 * @route PUT /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to update - eg: 1
 * @param {product_request.model} product.body.required - object with properties to update existing product with
 * @returns {product_response.model} 200 - the updated product object
 * @returns {Error} 500 - ID not found
 */
handlers.updateRecord = (req, res, next) => {
  req.model
    .update(req.params.id, req.body)
    .then((updatedRecord) => {
      res.status(200).json(updatedRecord);
    })
    .catch((error) => {
      console.error('error: failed to update record');
      next(error);
    });
};

/**
 * deletes an existing category object in the database
 * @route DELETE /categories/{id}
 * @param {string} id.path.required - the ID property of the individual category to delete
 * @returns {category_response.model} 200 - the deleted category object
 * @returns {Error} 500 - ID not found
 */

/**
 * deletes an existing category object in the database
 * @route DELETE /products/{id}
 * @param {string} id.path.required - the ID property of the individual product to delete
 * @returns {product_response.model} 200 - the deleted product object
 * @returns {Error} 500 - ID not found
 */
handlers.deleteRecord = (req, res, next) => {
  req.model
    .delete(req.params.id)
    .then((deletedRecord) => {
      res.status(200).send(deletedRecord);
    })
    .catch((error) => {
      console.error('error: failed to delete');
      next(error);
    });
};

module.exports = handlers;
