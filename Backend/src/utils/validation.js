/**
 * Format express-validator errors for 422 responses.
 */
function formatValidationErrors(errors) {
  return errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));
}

module.exports = { formatValidationErrors };
