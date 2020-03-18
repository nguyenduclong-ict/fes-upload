const Currency = _db('models/sale/Currency');
const { declareCRUD } = require('fesjs/lib/mongoose');
module.exports = {
  ...declareCRUD(Currency, 'Currency')
};
