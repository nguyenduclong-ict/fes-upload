const { createValidate } = require('../utils/fes-validation');

const schema = {
  name: {
    required: true,
    type: Boolean
  }
};

module.exports.testValidate = createValidate(schema, 'query');
