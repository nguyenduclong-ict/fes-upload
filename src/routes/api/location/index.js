const router = require('express').Router();
const provider = require('./location.provider');

router.get('/country/:code', provider.handleGetCountry);
router.get('/country', provider.handleGetMultipleCountry);
router.get('/city', provider.handleGetCity);
router.get('/district', provider.handleGetDistrict);

module.exports = router;
