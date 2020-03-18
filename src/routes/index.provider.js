const mongoose = require('mongoose');

// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// db
const { getManyUserRole, updateUserRole } = _db(
  'providers/base/UserRoleProvider'
);
const { getManyUser, fesUpdateUser } = _db('providers/base/UserProvider');
const { getManyConfig, updateConfig } = _db('providers/base/ConfigProvider');
const { getManyApp, updateApp } = _db('providers/chatbot/AppProvider');
const { getManyCurrency, updateCurrency } = _db(
  'providers/sale/CurrencyProvider'
);
const crawlCurrencyRate = _sv('schedules/crawl-currency-rate');

module.exports.handleInitDefaultData = async function(req, res, next) {
  try {
    const { password } = req.query;

    const [roles, users, apps, conifgs, currencies] = await Promise.all([
      getManyUserRole({}, { pagination: false }),
      getManyUser({}, { pagination: false, populate: ['roles'] }),
      getManyApp({}, { pagination: false }),
      getManyConfig({}, { pagination: false }),
      getManyCurrency({}, { pagination: false })
    ]);

    const appPasswordConfig = conifgs.find(c => c.key === 'app-password') || {
      _id: new mongoose.Types.ObjectId().toHexString(),
      key: 'app-password',
      value: 'long@123'
    };

    if (appPasswordConfig.value !== password) {
      res.status(401).send('Authentice failure! Password wrong!');
      return;
    }

    // user role
    const adminRole = roles.find(r => r.value === 'admin') || {
      _id: new mongoose.Types.ObjectId().toHexString(),
      value: 'admin',
      level: 0
    };
    const managerRole = roles.find(r => r.value === 'manager') || {
      _id: new mongoose.Types.ObjectId().toHexString(),
      value: 'manager',
      level: 1
    };
    const warehouseStaffRole = roles.find(r => r.value === 'staff') || {
      _id: new mongoose.Types.ObjectId().toHexString(),
      value: 'warehouse-staff',
      level: 2
    };

    const saleStaffRole = roles.find(r => r.value === 'staff') || {
      _id: new mongoose.Types.ObjectId().toHexString(),
      value: 'sale-staff',
      level: 2
    };
    // user admin
    _log(users);
    const adminUser = users.find(u =>
      u.roles.find(r => r.value === 'admin')
    ) || {
      _id: new mongoose.Types.ObjectId().toHexString(),
      username: 'admin',
      password: bcrypt.hashSync('admin@1234', salt),
      email: 'admin@hotmail.com',
      roles: [adminRole._id],
      is_block: false
    };

    // app main
    const appMain = apps[0] || {
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: 'Drize Bot',
      app_id: Math.random()
        .toString(36)
        .substring(0, 15),
      app_secret: '4d4b922a5a1342ccfa37166a0cff9a40',
      verify_token: 'longnd',
      server_url: 'https://chatbot-admin.negoo.tech',
      type: 'facebook'
    };

    // config
    const appConifg = conifgs.find(c => c.key === 'app-main-id') || {
      _id: new mongoose.Types.ObjectId().toHexString(),
      key: 'app-main-id'
    };
    appConifg.value = appConifg.value || appMain._id;

    // currency
    const USD = currencies.find(c => c.unit === 'USD') || {
      name: 'USD',
      unit: 'USD',
      rate: 1
    };

    const VND = currencies.find(c => c.unit === 'VND') || {
      name: 'VND',
      unit: 'VND',
      rate: 23000
    };

    console.log({
      adminRole,
      managerRole,
      saleStaffRole,
      warehouseStaffRole,
      adminUser,
      appMain,
      appConifg,
      appPasswordConfig
    });

    const result = await Promise.all([
      // role
      updateUserRole(adminRole, adminRole, { upsert: true }),
      updateUserRole(managerRole, managerRole, { upsert: true }),
      updateUserRole(saleStaffRole, saleStaffRole, { upsert: true }),
      updateUserRole(warehouseStaffRole, warehouseStaffRole, { upsert: true }),
      // user
      fesUpdateUser(adminUser, adminUser, { upsert: true }),
      // app
      updateApp(appMain, appMain, { upsert: true }),
      // config
      updateConfig(appConifg, appConifg, { upsert: true }),
      updateConfig(appPasswordConfig, appPasswordConfig, { upsert: true }),
      // currency
      updateCurrency(USD, USD, { upsert: true }),
      updateCurrency(VND, VND, { upsert: true })
    ]);

    // crawl currency rate
    crawlCurrencyRate();

    return res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send('server Error');
  }
};
