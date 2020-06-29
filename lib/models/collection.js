'use strict';

/** Interface class for performing CRUD operations */
class Collection {
  /**
   * Create a Collection.
   * @param {object} schema - schema to be used for CRUD operations
   */
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * gets either one or multiple records from a database depending on whether an ID param is provided
   * @param {string} id - request object (should contain path, method, and requestTime properties)
   * @returns (object|array) record object or array of record objects
   */
  get(id) {
    return id ? this.schema.findOne({ _id: id }) : this.schema.find({});
  }

  /**
   * creates an individual record adhering to the schema provided to the class
   * @param {object} record - raw object of the record to be added to the database
   * @returns (object) record object or array of record objects
   */
  create(record) {
    const newRecord = new this.schema(record);
    return newRecord.save();
  }

  /**
   * updates an individual record by searching for the given ID in the database
   * @param {object} id - ID of the record to edit
   * @param {object} record - raw object of the record properties to edit
   * @returns (object) the record in the database after it was updated
   */
  update(id, record) {
    return this.schema.findByIdAndUpdate(id, record, { new: true });
  }

  /**
   * deletes an individual record by searching for the given ID in the database
   * @param {object} id - ID of the record to delete
   * @returns (object) a copy of the deleted record
   */
  delete(id) {
    return this.schema.findByIdAndDelete(id);
  }
}

module.exports = Collection;
