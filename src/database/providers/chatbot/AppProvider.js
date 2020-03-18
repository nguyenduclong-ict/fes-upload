const App = _db('models/chatbot/App');
const { declareCRUD } = require('fesjs/lib/mongoose');
module.exports = {
  ...declareCRUD(App, 'App')
};
