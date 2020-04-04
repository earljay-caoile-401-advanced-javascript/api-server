'use strict';

const fs = require('fs');

module.exports = (req, res, next) => {
  let modelName = req.params.model;
  let modelFileName = `${__dirname}/../models/${modelName}/${modelName}-collection.js`;

  if (fs.existsSync(modelFileName)) {
    req.model = require(modelFileName);
    next();
  } else {
    next('invalid endpoint');
  }
};
