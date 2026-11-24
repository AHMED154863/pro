const mongoose = require('mongoose');
const { sendControllerError } = require('./controller-error');
const { getResourceBody, respondWithBodyError } = require('./resource-body');

function createResourceControllers(Model, fields, resourceName) {
  async function createResource(req, res) {
    const body = getResourceBody(req.body, fields);
    if (body.error) {
      return respondWithBodyError(res, body.error);
    }

    try {
      const resource = new Model(body.data);
      await resource.save();
      return res.status(201).json({ success: true, data: resource });
    } catch (error) {
      return sendControllerError(res, error, `Failed to create ${resourceName}`);
    }
  }

  async function updateResource(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: `${resourceName} id is invalid`,
      });
    }

    const body = getResourceBody(req.body, fields);
    if (body.error) {
      return respondWithBodyError(res, body.error);
    }

    try {
      const resource = await Model.findById(req.params.id);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${resourceName} not found`,
        });
      }

      resource.set(body.data);
      await resource.save();
      return res.status(200).json({ success: true, data: resource });
    } catch (error) {
      return sendControllerError(res, error, `Failed to update ${resourceName}`);
    }
  }

  async function deleteResource(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: `${resourceName} id is invalid`,
      });
    }

    try {
      const resource = await Model.findByIdAndDelete(req.params.id);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${resourceName} not found`,
        });
      }

      return res.status(200).json({ success: true, data: resource });
    } catch (error) {
      return sendControllerError(res, error, `Failed to delete ${resourceName}`);
    }
  }

  return { createResource, updateResource, deleteResource };
}

module.exports = { createResourceControllers };
