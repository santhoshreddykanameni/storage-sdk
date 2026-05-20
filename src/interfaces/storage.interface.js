class StorageInterface {
  /*
   |--------------------------------------------------------------------------
   | Basic Object Operations
   |--------------------------------------------------------------------------
   */

  async upload() {
    throw new Error("upload() not implemented");
  }

  async download() {
    throw new Error("download() not implemented");
  }

  async delete() {
    throw new Error("delete() not implemented");
  }

  async exists() {
    throw new Error("exists() not implemented");
  }

  async list() {
    throw new Error("list() not implemented");
  }

  async copy() {
    throw new Error("copy() not implemented");
  }

  async move() {
    throw new Error("move() not implemented");
  }

  /*
   |--------------------------------------------------------------------------
   | Signed URL Operations
   |--------------------------------------------------------------------------
   */

  async getUploadSignedUrl() {
    throw new Error("getUploadSignedUrl() not implemented");
  }

  async getDownloadSignedUrl() {
    throw new Error("getDownloadSignedUrl() not implemented");
  }

  /*
   |--------------------------------------------------------------------------
   | Multipart Upload Operations
   |--------------------------------------------------------------------------
   */

  async createMultipartUpload() {
    throw new Error("createMultipartUpload() not implemented");
  }

  async getMultipartUploadSignedUrl() {
    throw new Error("getMultipartUploadSignedUrl() not implemented");
  }

  async completeMultipartUpload() {
    throw new Error("completeMultipartUpload() not implemented");
  }

  async abortMultipartUpload() {
    throw new Error("abortMultipartUpload() not implemented");
  }

  /*
   |--------------------------------------------------------------------------
   | Health & Monitoring
   |--------------------------------------------------------------------------
   */

  async health() {
    throw new Error("health() not implemented");
  }

  /*
   |--------------------------------------------------------------------------
   | Provider Capabilities
   |--------------------------------------------------------------------------
   */

  capabilities() {
    throw new Error("capabilities() not implemented");
  }
}

module.exports = StorageInterface;
