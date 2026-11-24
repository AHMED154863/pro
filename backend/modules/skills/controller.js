const Skill = require('./model');
const { sendControllerError } = require('../../middleware/controller-error');
const { createResourceControllers } = require('../../middleware/resource-controller');

const skillAdminControllers = createResourceControllers(
  Skill,
  ['name', 'category', 'proficiency', 'featured'],
  'Skill',
);

async function listSkills(req, res) {
  try {
    const skills = await Skill.find();
    return res.status(200).json({ success: true, data: skills });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to retrieve skills');
  }
}

module.exports = { listSkills, ...skillAdminControllers };
