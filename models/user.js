'use strict';

/**
 * Module dependencies.
 */
const
  mongoose      = require('mongoose'),
  timestamp     = require('mongoose-timestamp'),
  deepPopulate  = require('mongoose-deep-populate');

/**
 * User Model Definition.
 * @type {Schema}
 */
const UserSchema = new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String
});


UserSchema.plugin(timestamp);
UserSchema.plugin(deepPopulate(mongoose));

mongoose.model('User', UserSchema);
module.exports = exports = UserSchema;