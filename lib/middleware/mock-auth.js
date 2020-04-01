module.exports = (req, res, next) => {
  req.params.authenticated = true;
  if (req.params.authenticated) {
    console.log('Authenticated!');
    next();
  } else {
    throw 'error: not authorized';
  }
};
