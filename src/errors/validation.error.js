const StorageError = require("./storage.error");

class ValidationError extends StorageError {
  constructor(message) {
    super(message);

    this.name = "ValidationError";
  }
}

module.exports = ValidationError;
