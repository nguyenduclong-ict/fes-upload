const { boostSocketIO } = require('./socket-io');
const boostSchedule = require('./schedules');

module.exports = function({ app, server }) {
  boostSocketIO(server);
  boostSchedule();
};
