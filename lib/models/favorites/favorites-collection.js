'use strict';

const Collection = require('../collection.js');
const schema = require('./favorites-schema.js');

class Favorites extends Collection {}

module.exports = new Favorites(schema);
