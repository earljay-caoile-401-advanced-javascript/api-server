'use strict';

/**
 * helper function used to create a reqestTime value and add is as a property to the request object
 * @param {object} req - request object to have new requestTime property added to
 * @param {object} res - response object (not used here)
 * @param (function) next - callback function
 */
module.exports = (req, res, next) => {
  const date = new Date();
  req.requestTime = date.toUTCString();
  next();
};
