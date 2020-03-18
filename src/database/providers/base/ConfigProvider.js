const Config = _db('models/base/Config');
const { declareCRUD } = require('fesjs/lib/mongoose');
module.exports = {
  ...declareCRUD(Config, 'Config')
};
