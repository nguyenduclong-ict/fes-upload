const { declareCRUD } = require('fesjs/lib/mongoose');
const UserRole = _db('models/base/UserRole');

module.exports = {
  ...declareCRUD(UserRole, 'UserRole')
};
