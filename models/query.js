'use strict';

/**
 * Module dependencies.
 */

const
  mongoose      = require('mongoose'),
  timestamp     = require('mongoose-timestamp');


/**
 * Query Model Definition.
 * @type {Schema}
 */
const QuerySchema = new mongoose.Schema({
  from: Object,
  query: String,
  offset: String
});

QuerySchema.plugin(timestamp);

mongoose.model('Query', QuerySchema);
module.exports = exports = QuerySchema;