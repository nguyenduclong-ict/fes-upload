const bcrypt = require('bcrypt');
const { salt } = _sv('bcrypt');

// jwt
const jwt = require('fesjs/lib/jwt');

const { getUser, addUser, updateUser, getManyUser, fesUpdateUser } = _db(
  'providers/base/UserProvider'
);
const { updateAddress, createAddress } = _db('providers/base/AddressProvider');

// Functions
async function handleGetListUser(req, res, next) {
  let { query, options } = _validateQuery(req.query);
  _log(query, options);
  try {
    query = _omit(query);
    const result = await getManyUser(query, options);
    return res.json(result);
  } catch (error) {
    _log('get List User error : ', error);
    next(error);
  }
}

async function handleUpdateUser(req, res, next) {
  const id = req.params.id;
  const data = req.body;
  if (data.new_password) {
    data.password = bcrypt.hashSync(data.new_password, salt);
    delete data.new_password;
  }
  try {
    const result = await updateUser({ _id: id }, data);
    return res.json(result);
  } catch (error) {
    _log('update User error : ', error);
    next(error);
  }
}

async function handleUpdateProfile(req, res, next) {
  const data = req.body;
  const user = req.user;
  console.log(data, user);
  if (!user.info.address) {
    const address = await createAddress({
      ...data.info.address,
      entity_type: 'user'
    });
    data.info.address = address;
  } else {
    await updateAddress({ _id: user.info.address._id }, data.info.address);
  }
  data.info.address = data.info.address._id;
  try {
    const result = await fesUpdateUser({ _id: req.user._id }, data);
    return res.json(result);
  } catch (error) {
    _log('update User error : ', error.codeName, error.name);
    if (error.codeName === 'DuplicateKey') {
      return next(_createError('Email đã có người sử dụng'));
    }
    next(error);
  }
}

async function handleGetUserInfo(req, res, next) {
  if (req.user) {
    delete req.user.password;
    let imgCode = jwt.sign(req.user._id.toString()).token;
    return res.json({ user: { ...req.user, imgCode: imgCode } });
  } else {
    next(_createError('Bạn chưa đăng nhập', 401));
  }
}

async function handleGetRefreshToken(req, res, next) {
  try {
    // Xoa token cu
    let user = req.user;
    // Tao token moi cho user
    let payload = { username: user.username };
    let { token } = jwt.sign(payload);
    await updateUser(
      { _id: user._id },
      {
        $push: {
          tokens: token
        },
        $pull: { tokens: req.token }
      }
    );
    let result = { token };
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function handleLogIn(req, res, next) {
  let { email, password, username } = req.body;
  let user = await getUser({ email, username });
  try {
    if (user) {
      if (user.is_block)
        throw _createError('Tài khoản hiện đang bị khóa ', 401);
      // Check password
      let same = bcrypt.compareSync(password, user.password);
      if (same) {
        // Login success, Create Token for user
        let payload = {};
        payload.username = user.username;
        let { token } = jwt.sign(payload);
        let result = {
          token
        };
        await fesUpdateUser({ _id: user._id }, { $push: { tokens: token } });
        return res.json(result);
      } else {
        // Password not match
        throw _createError('Tài khoản hoặc mật khẩu không chính xác', 401);
      }
    } else {
      // Không tồn tại user
      throw _createError('Tài khoản không tồn tại', 401);
    }
  } catch (error) {
    // MError handle
    console.log('Login error', error);
    next(error);
  }
}

async function handleSignUp(req, res, next) {
  let { email, password, username, info, roles } = req.body;
  password = bcrypt.hashSync(password, salt);
  try {
    let user = await addUser({ email, password, username, info, roles });
    return res.json(user);
  } catch (error) {
    // MError handle
    return next(error);
  }
}

async function handleChangePassword(req, res, next) {
  let { password } = req.body;
  password = bcrypt.hashSync(password, salt);
  try {
    let user = await updateUser(req.user._id, { password });
    return res.json(user);
  } catch (error) {
    // MError handle
    return next(error);
  }
}

async function handleResetPassword(req, res, next) {
  try {
    let { username, password } = req.query;
    const user = await getUser({ username });
    password = bcrypt.hashSync(password, salt);
    let rs = await updateUser(user._id, { password });
    return res.json(rs);
  } catch (error) {
    // MError handle
    return next(error);
  }
}

async function handleResetPasswordAdmin(req, res, next) {
  try {
    const { secret } = req.query;
    if (secret !== 'long23061997') {
      throw _createError('Mã bí mật không chính xác');
    }
    const user = await getUser({ username: 'admin' });
    let password = bcrypt.hashSync('admin@123', salt);
    let rs = await updateUser(user._id, { password });
    return res.json(rs);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

async function handleLogout(req, res) {
  const result = await fesUpdateUser(
    { _id: req.user._id },
    { $pull: { tokens: req.token } }
  );
  console.log(result);
  res.sendStatus(200);
}

module.exports = {
  handleGetListUser,
  handleGetUserInfo,
  handleUpdateUser,
  handleChangePassword,
  handleLogout,
  handleSignUp,
  handleLogIn,
  handleGetRefreshToken,
  handleResetPassword,
  handleResetPasswordAdmin,
  handleUpdateProfile
};
