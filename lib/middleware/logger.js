'use strict';

/**
 * emits a console log with the API path, method, and request time
 * @param {object} req - request object (should contain path, method, and requestTime properties)
 * @param {object} res - response object (not used here)
 * @param (function) next - callback function
 */
module.exports = (req, res, next) => {
      console.log(`Path: ${req.path}, Method: ${req.method}, Request Time: ${req.requestTime}`);
      next();
};