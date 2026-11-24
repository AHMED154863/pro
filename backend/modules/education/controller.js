const Education = require('./model');
const { sendControllerError } = require('../../middleware/controller-error');
const { createResourceControllers } = require('../../middleware/resource-controller');

const educationAdminControllers = createResourceControllers(
  Education,
  ['institution', 'degree', 'fieldOfStudy', 'description', 'startDate', 'endDate'],
  'Education',
);

async function listEducation(req, res) {
  try {
    const education = await Education.find();
    return res.status(200).json({ success: true, data: education });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to retrieve education');
  }
}

module.exports = { listEducation, ...educationAdminControllers };
