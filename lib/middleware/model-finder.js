'use strict';

const fs = require('fs');

/**
 * takes the value from req.params.model and attempts to find a matching model
 * @param {object} req - request object containing the params.model value for searching
 * @param {object} res - response object used to send the status code in case of an invalid model
 */
module.exports = (req, res, next) => {
  let modelName = req.params.model;
  let modelFileName = `${__dirname}/../models/${modelName}/${modelName}-collection.js`;

  if (fs.existsSync(modelFileName)) {
    req.model = require(modelFileName);
    next();
  } else {
    res.status(404).send('invalid model');
  }
};
