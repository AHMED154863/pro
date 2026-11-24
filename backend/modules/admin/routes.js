const express = require('express');
const certificationRoutes = require('../certifications/routes');
const educationRoutes = require('../education/routes');
const experienceRoutes = require('../experiences/routes');
const messageRoutes = require('../messages/routes');
const profileRoutes = require('../profile/routes');
const projectRoutes = require('../projects/routes');
const settingRoutes = require('../settings/routes');
const skillRoutes = require('../skills/routes');
const { requireLocalAdmin } = require('../../middleware/local-admin');
const { getDashboard } = require('./controller');
const { uploadCv, uploadProfileImage } = require('../../middleware/upload');
const { updateProfileCv, updateProfileImage } = require('../profile/controller');

const router = express.Router();

function handleUpload(uploadMiddleware) {
  return (req, res, next) => {
    uploadMiddleware(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message || 'File upload failed',
        });
      }

      return next();
    });
  };
}

router.use(requireLocalAdmin);
router.get('/dashboard', getDashboard);
router.post('/profile/image', handleUpload(uploadProfileImage), updateProfileImage);
router.post('/profile/cv', handleUpload(uploadCv), updateProfileCv);
router.use('/profile', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/experiences', experienceRoutes);
router.use('/education', educationRoutes);
router.use('/certifications', certificationRoutes);
router.use('/messages', messageRoutes);
router.use('/settings', settingRoutes);

module.exports = router;
