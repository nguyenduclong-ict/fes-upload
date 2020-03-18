const Location = _db('models/base/Location');
const { declareCRUD } = require('fesjs/lib/mongoose');

async function aggregateCountry(code, slug) {
  const query = code || slug ? { $or: [] } : {};
  if (code) {
    query.$or.push({ code });
  }
  if (slug) {
    query.$or.push({ slug });
  }
  return Location.aggregate()
    .match({
      type: 'country',
      ...query
    })
    .lookup({
      from: 'locations',
      as: 'childrens',
      let: { country: '$code' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$country_code', '$$country'] },
                { $eq: ['$type', 'city'] }
              ]
            }
          }
        },
        {
          $lookup: {
            from: 'locations',
            as: 'childrens',
            let: { district: '$code' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$parent_code', '$$district'] },
                      { $eq: ['$type', 'district'] }
                    ]
                  }
                }
              }
            ]
          }
        }
      ]
    })
    .exec();
}

module.exports = {
  ...declareCRUD(Location, 'Location'),
  aggregateCountry
};
