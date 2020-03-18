module.exports = async function managerRoleMiddleware(req, res, next) {
  // Check admin role
  try {
    if (!req.user) throw _createError('Please login first', 401);
    const pass = req.user.roles.find(role => role.value === 'manager');
    if (!pass) {
      throw _createError('You do not have access to this resource', 403);
    } else {
      next();
    }
  } catch (error) {
    return next(error);
  }
};
