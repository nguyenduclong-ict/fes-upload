const getUserInfo = require('./get-user-info');

module.exports = (roles = [], rule = 'and') =>
  async function(req, res, next) {
    getUserInfo(req, res, () => {
      // Check admin role
      try {
        const errors = [];
        if (!req.user) throw _createError('Please login first', 401);
        if (rule === 'and') {
          // rule and
          roles.forEach(role => {
            if (!req.user.roles.find(r => r.value === role)) {
              errors.push(role);
            }
          });

          if (errors.length > 0) {
            // have error
            throw _createError(
              `You not have roles [${errors.join(
                ','
              )}] to access this resource`,
              403
            );
          }
          return next();
        } else if (rule === 'or') {
          // rule or
          const pass = roles.some(role =>
            req.user.roles.find(r => r.value === role)
          );
          if (!pass) {
            throw _createError(
              `You not have one of roles [${roles.join(
                ','
              )}] to access resource`,
              403
            );
          }
          return next();
        }

        throw _createError(
          `You not have one of roles [${roles.join(',')}] to access resource`,
          403
        );
      } catch (error) {
        _log(error);
        return next(error);
      }
    });
  };
