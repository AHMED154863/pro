const Profile = require('./model');
const { sendControllerError } = require('../../middleware/controller-error');
const { getResourceBody, respondWithBodyError } = require('../../middleware/resource-body');

const profileFields = [
  'name',
  'professionalTitle',
  'professionalSummary',
  'education',
  'careerJourney',
  'professionalGoals',
  'email',
  'linkedInUrl',
  'githubUsername',
];

async function getProfile(req, res) {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to retrieve profile');
  }
}

async function updateProfile(req, res) {
  const body = getResourceBody(req.body, profileFields);
  if (body.error) {
    return respondWithBodyError(res, body.error);
  }

  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.set(body.data);
    await profile.save();
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to update profile');
  }
}

async function updateProfileAsset(req, res, field) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'A file is required',
    });
  }

  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.set(field, `/uploads/${req.file.filename}`);
    await profile.save();
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to update profile file');
  }
}

async function updateProfileImage(req, res) {
  return updateProfileAsset(req, res, 'profileImagePath');
}

async function updateProfileCv(req, res) {
  return updateProfileAsset(req, res, 'cvPath');
}

module.exports = { getProfile, updateProfile, updateProfileImage, updateProfileCv };
