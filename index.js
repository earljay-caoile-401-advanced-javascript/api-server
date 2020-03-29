'use strict';

require('dotenv').config();
const server = require('./lib/server.js');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

server.start(process.env.PORT || 3000);
