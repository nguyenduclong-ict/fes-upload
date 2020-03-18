var express = require('express');
var router = express.Router();

const provider = require('./index.provider');

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.json({});
});

router.get('/init-default-data', provider.handleInitDefaultData);
const { testValidate } = require('./index.validate');

router.get('/test-validation', testValidate, (req, res, next) => {
  res.json({ result: 'ok' });
});

module.exports = router;
