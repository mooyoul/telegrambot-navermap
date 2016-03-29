'use strict';

/**
 * Module dependencies.
 */

const
  mongoose      = require('mongoose'),
  timestamp     = require('mongoose-timestamp');


/**
 * Choice Model Definition.
 * @type {Schema}
 */
const ChoiceSchema = new mongoose.Schema({
  query: String,
  result_id: String
});

ChoiceSchema.plugin(timestamp);

mongoose.model('Choice', ChoiceSchema);
module.exports = exports = ChoiceSchema;