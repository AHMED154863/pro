const express = require('express');
const { requireLocalAdmin } = require('../../middleware/local-admin');
const { getProfile, updateProfile } = require('./controller');

const router = express.Router();

router.get('/', getProfile);
router.put('/', requireLocalAdmin, updateProfile);

module.exports = router;
