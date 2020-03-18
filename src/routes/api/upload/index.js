var express = require('express');
var router = express.Router();

const { handleUploadFiles, upload } = require('./upload.provider');

// Route
router.post(
  '/files',
  _md('get-user-info'),
  upload.array('files', 10),
  handleUploadFiles
);

module.exports = router;
