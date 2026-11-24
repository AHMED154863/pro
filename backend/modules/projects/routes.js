const express = require('express');
const { requireLocalAdmin } = require('../../middleware/local-admin');
const {
  createResource,
  deleteResource,
  getProjectById,
  listProjects,
  updateResource,
} = require('./controller');

const router = express.Router();

router.get('/', listProjects);
router.get('/:id', getProjectById);
router.post('/', requireLocalAdmin, createResource);
router.put('/:id', requireLocalAdmin, updateResource);
router.delete('/:id', requireLocalAdmin, deleteResource);

module.exports = router;
