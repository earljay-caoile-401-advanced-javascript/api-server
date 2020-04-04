'use strict';

let handlers = {};

/**
 * fetches an array of records (objects) along with the array count
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - callback function
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
 * fetches an individual record by searching with req.params.id
 * @param {object} req - request object (includes req.params.id for ID search)
 * @param {object} res - response object
 * @param {function} next - callback function
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
 * creates an individual record by saving the req.body object
 * @param {object} req - request object (includes req.body for creation)
 * @param {object} res - response object
 * @param {function} next - callback function
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
 * updates an existing record with req.params.id and req.body
 * @param {object} req - request object (includes req.body and req.params.id for update)
 * @param {object} res - response object
 * @param {function} next - callback function
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
 * deletes an existing record with req.params.id
 * @param {object} req - request object (includes req.params.id for delete)
 * @param {object} res - response object
 * @param {function} next - callback function
 */
handlers.deleteRecord = (req, res, next) => {
  req.model
    .delete(req.params.id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.error('error: failed to delete');
      next(error);
    });
};

module.exports = handlers;
