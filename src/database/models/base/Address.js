const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
  address: {
    type: String,
    default: ''
  },
  district_code: {
    type: String,
    default: ''
  },
  city_code: {
    type: String,
    default: ''
  },
  country_code: {
    type: String,
    default: ''
  },
  entity_type: {
    type: String,
    default: 'user'
  },
  created: { type: Date, default: Date.now() }
});

var Address = mongoose.model('Address', schema);

module.exports = Address;
