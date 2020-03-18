const { getLocation, getManyLocation, updateLocation } = _db(
  'providers/base/LocationProvider'
);

async function updateCountries() {
  const countries = [
    {
      name: 'Việt Nam',
      code: '84',
      slug: 'VN',
      type: 'country'
    }
  ];

  const results = await Promise.all(
    countries.map(country =>
      updateLocation({ type: 'country', code: country.code }, country, {
        upsert: true
      })
    )
  );

  console.log('Update Country ', results);
}

async function updateCities() {
  const citiesRaw = require('./tinh_tp.json');
  const cities = Object.entries(citiesRaw).map(e => ({
    name: e[1].name_with_type,
    type: 'city',
    code: e[1].code,
    country_code: '84',
    slug: e[1].slug
  }));
  console.log(cities);

  const results = await Promise.all(
    cities.map(city =>
      updateLocation({ type: 'city', code: city.code }, city, {
        upsert: true
      })
    )
  );

  console.log('Update cities ', results);
}

async function updateDistricts() {
  const districtsRaw = require('./quan_huyen.json');
  const districts = Object.entries(districtsRaw).map(e => ({
    name: e[1].name_with_type,
    type: 'district',
    code: e[1].code,
    country_code: '84',
    slug: e[1].slug,
    parent_code: e[1].parent_code
  }));
  console.log(districts);

  const results = await Promise.all(
    districts.map(district =>
      updateLocation({ type: 'district', code: district.code }, district, {
        upsert: true
      })
    )
  );

  console.log('Update districts ', results);
}

module.exports = async function() {
  const countries = await getManyLocation({ type: 'country' });
  console.log(countries);

  // update country
  updateCountries();

  // update cities
  updateCities();

  // update districts
  updateDistricts();
};
