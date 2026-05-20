const StorageError = require("./storage.error");

class UploadError extends StorageError {
  constructor(message) {
    super(message);

    this.name = "UploadError";
  }
}

module.exports = UploadError;
