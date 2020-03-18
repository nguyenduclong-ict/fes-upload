const validator = require('validator').default;
const _ = require('lodash');

function validateObject(data, schema, path = '', callback) {
  const ruleKeys = Object.keys(schema);
  ruleKeys.forEach(ruleKey => {
    dataCheck = _.get(data, ruleKey);
    dataRules = _.get(schema, ruleKey);

    Object.keys(dataRules).forEach(key => {
      const check = getValidator(
        key,
        _.get(dataRules, key),
        dataRules,
        dataCheck
      );
      if (check) {
        const message = check(dataCheck, _.get(dataRules, key), ruleKey);
        if (message) {
          callback({ path, param: ruleKey, message });
        }
      } else if (getDataType(_.get(dataRules, key)) === Object) {
        validateObject(dataCheck, dataRules, path + '/' + ruleKey, callback);
      }
    });
  });
  callback(null, path === '');
}

// return express middleware
module.exports.createValidate = (schema, target = 'body') => {
  return (req, res, next) => {
    const errors = [];
    const callback = (err, finished = false) => {
      if (err) errors.push({ ...err, target });
      if (finished) {
        if (errors.length > 0) {
          const error = new Error(`Validate ${target} error!`);
          error.name = 'fes-validation';
          error.data = { type: 'fes-validation', errors };
          next(error);
        } else {
          next();
        }
      }
    };
    validateObject(req[target], schema, '', callback);
  };
};

function getDataTypeName(type) {
  switch (type) {
    case Number:
      return 'Number';
    case Object:
      return 'Object';
    case String:
      return 'String';
    case JSON:
      return 'JSON';
    case Boolean:
      return 'Boolean';
    case Array:
      return 'Array';
    default:
      return null;
  }
}

function getDataType(data) {
  const type = typeof data;
  switch (type) {
    case 'string':
      return String;
    case 'number':
      return Number;
    case 'object':
      return Array.isArray(data) ? Array : Object;
    case 'boolean':
      return Boolean;
    default:
      return null;
  }
}

/**
 *
 * @param {String} rule  Rule key
 * @param {*} d Rule data
 */
function getValidator(rule, d, parent, dataCheck) {
  const validators = {
    type: (data, ruleData, key) => {
      if (![Number, Object, String, JSON, Boolean].includes(ruleData)) {
        return `Datatype of '${key}' not support`;
      } else {
        if (ruleData === Number) {
          console.log(data);
          data = Number(data);
        }

        if (ruleData === Boolean) {
          if (['TRUE', 'true', true].includes(data)) data = true;
          if (['FALSE', 'false', false].includes(data)) data = false;
        }

        if (getDataType(data) !== ruleData) {
          return `'${key}' must be a '${getDataTypeName(ruleData)}'`;
        }
      }
      return null;
    },
    enum: (data, list, key) => {
      if (![Array, String].includes(getDataType(list))) {
        return `Please declare enum for '${key}' is 'Array' of 'String'`;
      }
      if (!list.includes(data)) {
        return `'${key}' must be in '${JSON.stringify(list)}'`;
      }
      return null;
    },
    required: (data, ruleData, key) => {
      if (ruleData && [null, undefined].includes(data)) {
        return `'${key}' is required`;
      }
      return null;
    },
    minLength: (data, minLength, key) => {
      if (![String, Array].includes(getDataType(data))) {
        return `Type of '${key}' must be a 'String' or 'Array'`;
      } else {
        if (data.length < minLength) {
          return `minLength of '${key}' must be ${minLength}`;
        }
      }
    },
    maxLength: (data, maxLength, key) => {
      if (![String, Array].includes(getDataType(data))) {
        return `Type of '${key}' must be a 'String' or 'Array'`;
      } else {
        if (data.length > maxLength) {
          return `maxLength of '${key}' must be ${maxLength}`;
        }
      }
    },
    length: (data, length, key) => {
      if (![String, Array].includes(getDataType(data))) {
        return `Type of '${key}' must be a 'String' or 'Array'`;
      } else {
        if (data.length !== length) {
          return `Length of '${key}' must be equal to  ${length}`;
        }
      }
    },
    gt: (data, value, key) => {
      if (getDataType(data) !== Number) {
        return `Type of '${key}' must be a 'Number'`;
      } else {
        if (data <= value) {
          return `Value of '${key}' must be greater than ${value}`;
        }
      }
    },
    gte: (data, value, key) => {
      if (getDataType(data) !== Number) {
        return `Type of '${key}' must be a 'Number'`;
      } else {
        if (data < value) {
          return `Value of '${key}' must be greater than or equal to ${value}`;
        }
      }
    },
    lt: (data, value, key) => {
      if (getDataType(data) !== Number) {
        return `Type of '${key}' must be a 'Number'`;
      } else {
        if (data >= value) {
          return `Value of '${key}' must be less than ${value}`;
        }
      }
    },
    lte: (data, value, key) => {
      if (getDataType(data) !== Number) {
        return `Type of '${key}' must be a 'Number'`;
      } else {
        if (data > value) {
          return `Value of '${key}' must be less than or equal to ${value}`;
        }
      }
    },
    eq: (data, value, key) => {
      if (getDataType(data) !== Number) {
        return `Type of '${key}' must be a 'Number'`;
      } else {
        if (data !== value) {
          return `Value of '${key}' must be equal to ${value}`;
        }
      }
    },
    isEmail: (data, rule, key) => {
      if (!validator.isEmail(data || '')) {
        return `'${key}' must be a Email`;
      }
      return null;
    },
    isPhoneNumber: (data, rule, key) => {
      if (!validator.isMobilePhone(data || '')) {
        return `'${key}' must be a PhoneNumber`;
      }
      return null;
    }
  };

  const validatorTypes = {
    type: d => [Number, Object, String, JSON, Boolean].includes(d),
    enum: d => [Array, String].includes(getDataType(d)),
    required: d => getDataType(d) === Boolean,
    minLength: d => getDataType(d) === Number && Number.isInteger(d) && d >= 0,
    maxLength: d => getDataType(d) === Number && Number.isInteger(d) && d >= 0,
    length: d => getDataType(d) === Number && Number.isInteger(d) && d >= 0,
    gt: d => getDataType(d) === Number, // greater than
    lt: d => getDataType(d) === Number, // less than
    gte: d => getDataType(d) === Number,
    lte: d => getDataType(d) === Number,
    eq: d => getDataType(d) === Number, // equal to
    isEmail: d => getDataType(d) === Boolean,
    isPhoneNumber: d => getDataType(d) === Boolean
  };

  const isRequired = !!parent.required;
  if (!isRequired && !dataCheck) return null;
  if (typeof validatorTypes[rule] === 'function' && validatorTypes[rule](d)) {
    return validators[rule];
  }
  return null;
}
