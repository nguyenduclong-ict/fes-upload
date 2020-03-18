const path = require('path');
const lodash = require('lodash');

module.exports = {
  global: {
    names: ['createError', 'validateQuery'],
    dirroot: path.join(__dirname, '../'),
    additions: [{ name: '_', value: lodash }]
  },
  server: {
    port: 3001,
    routerPath: null,
    exceptFile: /.\.provider$|.\.validate$/gm,
    middlewarePath: null,
    servicePath: null,
    globalMiddlewares: []
  },
  env: {
    NODE_ENV: 'development',
    UPLOAD_PATH: 'upload'
  },
  jwt: {
    secret: 'longnd',
    tokenExpires: 5184000
  },
  database: {
    type: 'mongodb',
    mongodb: {
      port: 27017,
      dbName: 'fes-upload',
      host: 'f1micro.vps',
      user: 'longnd',
      pass: 'long@123'
    }
  }
};
