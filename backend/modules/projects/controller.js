const mongoose = require('mongoose');
const Project = require('./model');
const { sendControllerError } = require('../../middleware/controller-error');
const { createResourceControllers } = require('../../middleware/resource-controller');

const projectAdminControllers = createResourceControllers(
  Project,
  [
    'title',
    'slug',
    'summary',
    'overview',
    'problem',
    'solution',
    'features',
    'technologies',
    'screenshots',
    'category',
    'featured',
    'githubUrl',
    'liveDemoUrl',
  ],
  'Project',
);

async function listProjects(req, res) {
  try {
    const projects = await Project.find();
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to retrieve projects');
  }
}

async function getProjectById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Project id is invalid',
    });
  }

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to retrieve project');
  }
}

module.exports = { listProjects, getProjectById, ...projectAdminControllers };
