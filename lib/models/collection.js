'use strict';

const uuid = require('uuid').v4;
const validator = require('../models/validator.js');

class Collection {
  constructor(schema) {
    this.database = [];
    this.schema = schema;
  }

  get(id) {
    let response = id
      ? this.database.filter((record) => record.id === id)
      : this.database;
    return Promise.resolve(response);
  }

  create(record) {
    record.id = uuid();
    if (validator.isValid(record, this.schema)) {
      this.database.push(record);
      return Promise.resolve(record);
    } else {
      return Promise.reject('Invalid object');
    }
  }

  update(id, record) {
    record.id = id;
    if (validator.isValid(record, this.schema)) {
      this.database = this.database.map((item) =>
        item.id === id ? record : item,
      );
      return Promise.resolve(record);
    } else {
      return Promise.reject('Invalid object');
    }
  }

  delete(id) {
    let recToDel;
    this.database = this.database.filter((record) => {
      if (record.id === id) {
        recToDel = record;
      }
      return record.id !== id;
    });
    return Promise.resolve(recToDel);
  }
}

module.exports = Collection;
