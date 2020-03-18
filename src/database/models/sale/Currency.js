const mongoose = require('mongoose');
const { declareHook } = require('fesjs/lib/mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  name: {
    type: String,
    default: ''
  },
  rate: {
    type: Number,
    validate: {
      validator: v => isFinite(v) && Number(v) > 0,
      message: 'Tỉ giá trao đổi phải >= 0'
    },
    default: 1
  },
  unit: {
    type: String,
    unique: true,
    required: true
  },
  created: { type: Date, default: Date.now() }
});

var Currency = mongoose.model('Currency', schema);
declareHook(schema, 'Currency');

module.exports = Currency;
