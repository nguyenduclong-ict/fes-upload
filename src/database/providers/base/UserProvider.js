const User = _db('models/base/User');
const { declareCRUD, declareHook } = require('fesjs/lib/mongoose');
const { getManyUserRole } = require('./UserRoleProvider');
/**
 *
 * @param {{email, password, info, role, username }} param0
 */

async function addUser({
  email,
  password,
  name,
  address,
  facebook_id,
  phone,
  roles = [],
  username
}) {
  try {
    // check user roles
    let isBlock = false;
    const docs = await getManyUserRole(
      {
        value: {
          $in: roles
        }
      },
      { pagination: false }
    );
    if (docs.length < roles.length) throw _createError('Roles not exits');
    if (docs.some(e => e.value === 'admin')) isBlock = true;
    const data = {
      username,
      password,
      name,
      address,
      phone,
      facebook_id,
      is_block: isBlock,
      roles: docs.map(r => r._id)
    };

    if (email) data.email = email;
    let user = new User(data);
    // add user info
    // Add default data for user
    const tasks = [user.save()];
    const results = await Promise.all(tasks);
    return results[0];
  } catch (error) {
    _log('add user error', error);
    return error;
  }
}

/**
 * Get User Info
 * @param {*} param0
 */

async function getUser(query) {
  query = _omit(query, [null, undefined]);
  if (query === {}) return null;
  let user = await User.findOne(query)
    .populate('roles')
    .populate({
      path: 'info.address',
      model: 'Address'
    })
    .lean();
  return user;
}

/**
 * Update user
 * @param {*} _id user id
 * @param {*} param1
 */
async function updateUser(_id, data) {
  let user = await User.findById(_id);
  if (!user) return false;

  user = user.toObject();
  data = _omit(data, [null, undefined]);
  Object.assign(user, data);
  // Update User Info
  return User.updateOne({ _id: user._id }, user);
}

const CRUD = declareCRUD(User, 'User');

CRUD.fesUpdateUser = CRUD.updateUser;

module.exports = {
  ...CRUD,
  addUser,
  updateUser,
  getUser
};
