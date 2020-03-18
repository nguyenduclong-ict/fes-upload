const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  name: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['country', 'district', 'city']
  },
  code: {
    type: String
  },
  parent_code: {
    type: String
  },
  country_code: {
    type: String
  },
  slug: {
    type: String
  },
  created: { type: Date, default: Date.now() }
});

var Location = mongoose.model('Location', schema);

module.exports = Location;
