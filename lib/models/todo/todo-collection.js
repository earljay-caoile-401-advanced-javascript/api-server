'use strict';

const Collection = require('../collection.js');
const schema = require('./todo-schema.js');

class Todo extends Collection {}

module.exports = new Todo(schema);
