'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./lib/server.js');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

server.start(process.env.PORT || 3000);
