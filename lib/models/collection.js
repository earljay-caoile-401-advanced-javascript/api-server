'use strict';

const uuid = require('uuid').v4;
const validator = require('../models/validator.js');

/** Interface class for performing CRUD operations */
class Collection {
  /**
   * Create a Collection.
   * @param {object} schema - schema to be used for in-memory validation
   */
  constructor(schema) {
    this.database = [];
    this.schema = schema;
  }

  /**
   * gets either one or multiple records from a database depending on whether an ID param is provided
   * @param {string} id - request object (should contain path, method, and requestTime properties)
   * @returns (object|array) record object or array of record objects
   */
  get(id) {
    let response = id
      ? this.database.filter((record) => record.id === id)
      : this.database;
    return Promise.resolve(response);
  }

  /**
   * creates an individual record adhering to the schema provided to the class
   * @param {object} record - raw object of the record to be added to the database
   * @returns (object) record object or array of record objects
   */
  create(record) {
    record.id = uuid();
    if (validator.isValid(record, this.schema)) {
      this.database.push(record);
      return Promise.resolve(record);
    } else {
      return Promise.reject('Invalid object');
    }
  }

  /**
   * updates an individual record by searching for the given ID in the database
   * @param {object} id - ID of the record to edit
   * @param {object} record - raw object of the record properties to edit
   * @returns (object) the record in the database after it was updated
   */
  update(id, record) {
    record.id = id;
    let foundRec = false;
    if (validator.isValid(record, this.schema)) {
      this.database = this.database.map((item) => {
        if (item.id === id) {
          foundRec = true;
        }
        return item.id === id ? record : item;
      });

      if (!foundRec) {
        throw 'ID not found';
      }

      return Promise.resolve(record);
    } else {
      return Promise.reject('Invalid object');
    }
  }

  /**
   * deletes an individual record by searching for the given ID in the database
   * @param {object} id - ID of the record to delete
   * @returns (object) a copy of the deleted record
   */
  delete(id) {
    let recToDel;
    this.database = this.database.filter((record) => {
      if (record.id === id) {
        recToDel = record;
      }
      return record.id !== id;
    });

    if (!recToDel) {
      throw 'error: ID not found';
    }
    return Promise.resolve(recToDel);
  }
}

module.exports = Collection;
