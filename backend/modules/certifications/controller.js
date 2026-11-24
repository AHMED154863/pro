const Certification = require('./model');
const { sendControllerError } = require('../../middleware/controller-error');
const { createResourceControllers } = require('../../middleware/resource-controller');

const certificationAdminControllers = createResourceControllers(
  Certification,
  ['name', 'issuer', 'description', 'issuedAt', 'credentialUrl'],
  'Certification',
);

async function listCertifications(req, res) {
  try {
    const certifications = await Certification.find();
    return res.status(200).json({ success: true, data: certifications });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to retrieve certifications');
  }
}

module.exports = { listCertifications, ...certificationAdminControllers };
