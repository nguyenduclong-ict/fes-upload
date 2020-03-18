const Address = _db('models/base/Address');
const { declareCRUD } = require('fesjs/lib/mongoose');
module.exports = {
  ...declareCRUD(Address, 'Address')
};
