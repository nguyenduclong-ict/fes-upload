const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  name: {
    type: String,
    default: ''
  },
  key: {
    type: String,
    unique: true
  },
  value: {
    type: String,
    default: ''
  },
  entity_type: {
    type: String,
    default: 'system'
  },
  created: { type: Date, default: Date.now() }
});

var Config = mongoose.model('Config', schema);

module.exports = Config;
