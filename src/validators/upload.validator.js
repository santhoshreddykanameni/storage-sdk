const ValidationError = require("../errors/validation.error");

class UploadValidator {
  static validate({ key, body }) {
    if (!key) {
      throw new ValidationError("key is required");
    }

    if (!body) {
      throw new ValidationError("body is required");
    }
  }
}

module.exports = UploadValidator;
