const { aggregateCountry } = _db('providers/base/LocationProvider');

module.exports.handleGetCountry = async function(req, res, next) {
  const { code } = req.params;
  const results = await aggregateCountry(code, code);
  return res.json(results[0]);
};

module.exports.handleGetMultipleCountry = async function(req, res, next) {
  const results = await aggregateCountry();
  return res.json(results);
};

module.exports.handleGetCity = async function() {};

module.exports.handleGetDistrict = async function() {};
