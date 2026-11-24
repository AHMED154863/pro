const cors = require('cors');
const express = require('express');
const path = require('node:path');

const profileRoutes = require('./modules/profile/routes');
const projectRoutes = require('./modules/projects/routes');
const skillRoutes = require('./modules/skills/routes');
const experienceRoutes = require('./modules/experiences/routes');
const educationRoutes = require('./modules/education/routes');
const certificationRoutes = require('./modules/certifications/routes');
const messageRoutes = require('./modules/messages/routes');
const adminRoutes = require('./modules/admin/routes');

const app = express();
const uploadDirectory = path.join(__dirname, 'uploads');

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:4200',
}));
app.use(express.json());
app.use('/uploads', express.static(uploadDirectory));

app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/experiences', experienceRoutes);
app.use('/api/v1/education', educationRoutes);
app.use('/api/v1/certifications', certificationRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

module.exports = app;
