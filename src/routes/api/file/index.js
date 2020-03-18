var express = require('express');
var router = express.Router();

const mdGetUserInfo = _md('get-user-info');

const {
  handleGetFile,
  handleGetFileInfo,
  handleUpdateFile
} = require('./file.provider');

// Route
router.get('/:filename', handleGetFile);
router.get('/info', mdGetUserInfo, handleGetFileInfo);
router.put('/update', mdGetUserInfo, handleUpdateFile);

module.exports = router;
