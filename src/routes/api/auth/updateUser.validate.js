const { createValidate } = _util('fes-validation');

const schema = {
  email: {
    type: String,
    isEmail: true
  },
  info: {
    name: {
      type: String
    },
    image: {
      type: String
    },
    phone: {
      type: String,
      isPhoneNumber: true
    },
    gender: {
      type: String,
      enum: ['male', 'female']
    },
    address: {
      address: {
        type: String
      },
      city_code: {
        type: String
      },
      district_code: {
        type: String
      },
      country_code: {
        type: String
      }
    }
  }
};

module.exports = createValidate(schema, 'body');
