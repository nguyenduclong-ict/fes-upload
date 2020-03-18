const mongoose = require('mongoose');
const validator = require('validator');
const { declareHook } = require('fesjs/lib/mongoose');
const uuid = require('uuid').v4;
var Schema = mongoose.Schema;

/**
 * Defind model
 */

var schema = new Schema({
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    minlength: 4,
    unique: true,
    required: true
  },
  email: {
    type: String,
    validate: {
      validator: v => {
        return validator.isEmail(v);
      }
    },
    unique: true,
    default: function() {
      return this.username + '@hotmail.com';
    }
  },
  info: {
    type: {
      name: String,
      address: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
      },
      image: String,
      phone: String,
      gender: {
        type: String,
        enum: ['male', 'female']
      }
    },
    default: {
      name: '',
      address: null,
      image: 'https://d8.negoo.tech/sites/default/files/2020-02/account.svg',
      gender: 'male',
      phone: ''
    }
  },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'UserRole'
    }
  ],
  staff_of: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  facebook_id: {
    type: String,
    default: null
  },
  is_block: {
    type: Boolean,
    default: true,
    required: true
  },
  tokens: {
    type: [String],
    default: []
  },
  created: { type: Date, default: Date.now() }
});

var User = mongoose.model('User', schema);
declareHook(schema, 'User');

module.exports = User;
