const express = require('express');
const { requireLocalAdmin } = require('../../middleware/local-admin');
const { createResource, deleteResource, listEducation, updateResource } = require('./controller');

const router = express.Router();

router.get('/', listEducation);
router.post('/', requireLocalAdmin, createResource);
router.put('/:id', requireLocalAdmin, updateResource);
router.delete('/:id', requireLocalAdmin, deleteResource);

module.exports = router;
