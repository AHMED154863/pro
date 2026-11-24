function getResourceBody(body, allowedFields) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be an object' };
  }

  const keys = Object.keys(body);
  if (keys.length === 0) {
    return { error: 'Request body must contain at least one supported field' };
  }

  const allowedFieldsSet = new Set(allowedFields);
  const unsupportedField = keys.find((key) => !allowedFieldsSet.has(key));
  if (unsupportedField) {
    return { error: `Unsupported field: ${unsupportedField}` };
  }

  return {
    data: Object.fromEntries(keys.map((key) => [key, body[key]])),
  };
}

function respondWithBodyError(res, error) {
  return res.status(400).json({
    success: false,
    message: error,
  });
}

module.exports = { getResourceBody, respondWithBodyError };
