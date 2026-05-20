const StorageError = require("./storage.error");

class MultipartError extends StorageError {
  constructor(
    message,

    options = {},
  ) {
    super(message);

    this.name = "MultipartError";

    /*
     |--------------------------------------------------------------------------
     | Additional Context
     |--------------------------------------------------------------------------
     */

    this.uploadId = options.uploadId;

    this.partNumber = options.partNumber;

    this.key = options.key;

    this.bucket = options.bucket;

    this.originalError = options.originalError;

    /*
     |--------------------------------------------------------------------------
     | Capture Stack Trace
     |--------------------------------------------------------------------------
     */

    Error.captureStackTrace(this, this.constructor);
  }

  /*
   |--------------------------------------------------------------------------
   | JSON Serialization
   |--------------------------------------------------------------------------
   */

  toJSON() {
    return {
      name: this.name,

      message: this.message,

      uploadId: this.uploadId,

      partNumber: this.partNumber,

      key: this.key,

      bucket: this.bucket,

      originalError: this.originalError ? this.originalError.message : null,
    };
  }
}

module.exports = MultipartError;
