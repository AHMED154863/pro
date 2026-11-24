const express = require('express');
const { requireLocalAdmin } = require('../../middleware/local-admin');
const {
  createMessage,
  deleteMessage,
  listAdminMessages,
  updateMessage,
} = require('./controller');
const { validateMessage } = require('./validation');

const router = express.Router();

router.post('/', validateMessage, createMessage);
router.get('/', requireLocalAdmin, listAdminMessages);
router.put('/:id', requireLocalAdmin, updateMessage);
router.delete('/:id', requireLocalAdmin, deleteMessage);

module.exports = router;
