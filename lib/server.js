'use strict';

// 3rd party dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// dependencies we made
const notFoundHandler = require('./middleware/404.js');
const errorHandler = require('./middleware/500.js');

const apiRoutes = require('./routes/api.js');
const timestamp = require('./middleware/timestamp.js');
const logger = require('./middleware/logger.js');

const app = express();

// the magic that creates our swagger documentation
const swaggerGen = require('../docs/swagger.js');
swaggerGen(app);

// 3rd party global middleware
app.use(cors());
app.use(morgan('dev'));

// own middleware
app.use(express.json());
app.use(timestamp);
app.use(logger);

// dummy route to display on homepage
app.get('/', (req, res) => res.send('API is up! Hooray!'));

app.use('/api/v1', apiRoutes);

// error handling (unsupported routes)
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  apiServer: app,
  start: (port) => {
    app.listen(port, () => console.log('running on', port));
  },
};
