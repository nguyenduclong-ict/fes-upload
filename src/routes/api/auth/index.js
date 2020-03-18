var express = require('express');
var router = express.Router();

// middleware
const getUserInfo = _md('get-user-info');
const authAdmin = _md('admin-role');

const {
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
} = require('./auth.provider');
const updateUserValidator = require('./updateUser.validate');

// Route
router.get('/me', getUserInfo, handleGetUserInfo);
router.post('/login', handleLogIn);
router.put('/change-password', getUserInfo, handleChangePassword);
router.post('/logout', getUserInfo, handleLogout);
router.post('/signup', handleSignUp);
router.get('/refresh-token', getUserInfo, handleGetRefreshToken);
router.get('/user', getUserInfo, authAdmin, handleGetListUser);
router.put('/user/:id', getUserInfo, authAdmin, handleUpdateUser);
router.put('/me', getUserInfo, updateUserValidator, handleUpdateProfile);
router.get('/reset-password', handleResetPassword);
router.get('/reset-password-admin', handleResetPasswordAdmin);
module.exports = router;
