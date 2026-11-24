const mongoose = require('mongoose');
const Message = require('./model');
const { sendControllerError } = require('../../middleware/controller-error');
const { getResourceBody, respondWithBodyError } = require('../../middleware/resource-body');

async function createMessage(req, res) {
  try {
    const message = new Message(req.body);
    await message.save();

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to save contact message');
  }
}

async function listAdminMessages(req, res) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to retrieve messages');
  }
}

async function updateMessage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Message id is invalid',
    });
  }

  const body = getResourceBody(req.body, ['isRead']);
  if (body.error) {
    return respondWithBodyError(res, body.error);
  }
  if (typeof body.data.isRead !== 'boolean') {
    return respondWithBodyError(res, 'isRead must be a boolean');
  }

  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    message.isRead = body.data.isRead;
    await message.save();
    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to update message');
  }
}

async function deleteMessage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Message id is invalid',
    });
  }

  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    return sendControllerError(res, error, 'Failed to delete message');
  }
}

module.exports = { createMessage, listAdminMessages, updateMessage, deleteMessage };
