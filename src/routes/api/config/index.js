const express = require('express');
const router = express.Router();

const {
  handleGetListConfig,
  handleGetConfig,
  handleCreateConfig,
  handleUpdateConfig,
  handleUpdateManyConfig,
  handleDeleteConfig,
  handleDeleteManyConfig
} = require('./config.provider');

// Middleware
router.use(_md('get-user-info'), _md('admin-role'));

// route
router.get('/', handleGetListConfig);
router.get('/:id', handleGetConfig);

router.post('/', handleCreateConfig);

router.put('/:id', handleUpdateConfig);
router.put('/', handleUpdateManyConfig);

router.delete('/:id', handleDeleteConfig);
router.post('/', handleDeleteManyConfig);

// Export module
module.exports = router;
