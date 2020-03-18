const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  name: { type: String, default: '' },
  app_id: {
    type: String,
    unique: true
  },
  verify_token: {
    type: String,
    required: true
  },
  app_secret: {
    type: String,
    required: true
  },
  server_url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['facebook', 'zalo', 'instagram']
  },
  mode: {
    type: String,
    enum: ['main', 'preparatory']
  },
  created: { type: Date, default: Date.now() }
});

var App = mongoose.model('App', schema);

module.exports = App;
