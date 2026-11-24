const Experience = require('./model');
const { sendControllerError } = require('../../middleware/controller-error');
const { createResourceControllers } = require('../../middleware/resource-controller');

const experienceAdminControllers = createResourceControllers(
  Experience,
  ['organization', 'title', 'description', 'startDate', 'endDate', 'isCurrent'],
  'Experience',
);

async function listExperiences(req, res) {
  try {
    const experiences = await Experience.find();
    return res.status(200).json({ success: true, data: experiences });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to retrieve experiences');
  }
}

module.exports = { listExperiences, ...experienceAdminControllers };
