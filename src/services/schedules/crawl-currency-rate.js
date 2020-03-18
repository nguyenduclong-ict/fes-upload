const { getManyCurrency, updateCurrency } = _db(
  'providers/sale/CurrencyProvider'
);
const axios = require('axios').default;
async function crawlCurrencyRate() {
  const currencies = await getManyCurrency({}, { pagination: false });
  const api = 'https://free.currconv.com/api/v7/convert';
  const apiKey = '3c99395d30fb56c6ab0a';

  const requests = currencies.map(
    currency =>
      new Promise(async (resolve, reject) => {
        const response = await axios.get(api, {
          params: {
            q: `USD_${currency.unit}`,
            compact: 'ultra',
            apiKey
          }
        });
        resolve({
          unit: currency.unit,
          rate: response.data[`USD_${currency.unit}`]
        });
      })
  );

  let response = await Promise.all(requests);
  console.log(response);

  const taskUpdate = response.map(data =>
    updateCurrency({ unit: data.unit }, data, { upsert: true })
  );

  const result = await Promise.all(taskUpdate);
  _log(result);
}

module.exports = {
  rule: '0 0 0 * * *',
  callback: crawlCurrencyRate
};
