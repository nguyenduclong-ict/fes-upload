const schedule = require('node-schedule');
const { importAll } = require('fesjs/lib/global');

const schedules = importAll(__dirname, /index|log/);

module.exports = function() {
  schedules.forEach(sch => {
    schedule.scheduleJob(sch.instance.rule, sch.instance.callback);
  });
};
