const Setting = require('./model');
const { createResourceControllers } = require('../../middleware/resource-controller');
const { sendControllerError } = require('../../middleware/controller-error');

const settingAdminControllers = createResourceControllers(Setting, ['key', 'value'], 'Setting');

async function listSettings(req, res) {
  try {
    const settings = await Setting.find().sort({ key: 1 });
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to retrieve settings');
  }
}

module.exports = { listSettings, ...settingAdminControllers };
