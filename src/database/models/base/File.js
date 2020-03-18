const mongoose = require('mongoose');
const { declareHook } = require('fesjs/lib/mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  filename: {
    type: String,
    default: function() {
      return `${this.filetype}-${this._id}.${this.ext}`;
    },
    required: true
  },
  path: {
    type: String,
    default: '',
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  ext: {
    type: String,
    default: 'txt'
  },
  subOwner: [
    {
      type: Schema.Types.ObjectId,
      default: []
    }
  ],
  filetype: {
    type: String,
    default: ''
  },
  tags: [{ type: String, default: [] }],
  isPublic: {
    type: Boolean,
    default: true,
    required: true
  },
  created: { type: Date, default: Date.now() }
});

declareHook(schema, 'File');
var File = mongoose.model('File', schema);

module.exports = File;
