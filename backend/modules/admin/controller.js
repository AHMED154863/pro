const Certification = require('../certifications/model');
const Education = require('../education/model');
const Experience = require('../experiences/model');
const Message = require('../messages/model');
const Project = require('../projects/model');
const Skill = require('../skills/model');

function toActivity(type, record, title) {
  return {
    id: record._id,
    type,
    title,
    occurredAt: record.updatedAt || record.createdAt,
  };
}

async function getDashboard(req, res) {
  try {
    const [
      totalProjects,
      totalSkills,
      totalMessages,
      unreadMessages,
      projects,
      skills,
      experiences,
      education,
      certifications,
      messages,
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Project.find().select('title createdAt updatedAt'),
      Skill.find().select('name createdAt updatedAt'),
      Experience.find().select('organization title createdAt updatedAt'),
      Education.find().select('institution degree createdAt updatedAt'),
      Certification.find().select('name issuer createdAt updatedAt'),
      Message.find().select('name createdAt updatedAt'),
    ]);

    const recentActivities = [
      ...projects.map((record) => toActivity('Project', record, record.title)),
      ...skills.map((record) => toActivity('Skill', record, record.name)),
      ...experiences.map((record) =>
        toActivity('Experience', record, `${record.title} at ${record.organization}`),
      ),
      ...education.map((record) =>
        toActivity('Education', record, `${record.degree} at ${record.institution}`),
      ),
      ...certifications.map((record) =>
        toActivity('Certification', record, record.name),
      ),
      ...messages.map((record) => toActivity('Message', record, `Message from ${record.name}`)),
    ]
      .sort((left, right) => new Date(right.occurredAt) - new Date(left.occurredAt))
      .slice(0, 8);

    return res.status(200).json({
      success: true,
      data: { totalProjects, totalSkills, totalMessages, unreadMessages, recentActivities },
    });
  } catch (error) {
    console.error('Failed to retrieve admin dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin dashboard',
    });
  }
}

module.exports = { getDashboard };
