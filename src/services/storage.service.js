class StorageService {
  constructor(provider) {
    this.provider = provider;
  }

  /*
   |--------------------------------------------------------------------------
   | Basic Object Operations
   |--------------------------------------------------------------------------
   */

  async upload(data) {
    return this.provider.upload(data);
  }

  async download(key) {
    return this.provider.download(key);
  }

  async delete(key) {
    return this.provider.delete(key);
  }

  async exists(key) {
    return this.provider.exists(key);
  }

  async list(prefix) {
    return this.provider.list(prefix);
  }

  async copy(source, destination) {
    return this.provider.copy(source, destination);
  }

  async move(source, destination) {
    return this.provider.move(source, destination);
  }

  /*
   |--------------------------------------------------------------------------
   | Signed URL Operations
   |--------------------------------------------------------------------------
   */

  async getUploadSignedUrl(data) {
    return this.provider.getUploadSignedUrl(data);
  }

  async getDownloadSignedUrl(key, expiresIn = 3600) {
    return this.provider.getDownloadSignedUrl(key, expiresIn);
  }

  /*
   |--------------------------------------------------------------------------
   | Multipart Upload Operations
   |--------------------------------------------------------------------------
   */

  async createMultipartUpload(data) {
    return this.provider.createMultipartUpload(data);
  }

  async getMultipartUploadSignedUrl(data) {
    return this.provider.getMultipartUploadSignedUrl(data);
  }

  async completeMultipartUpload(data) {
    return this.provider.completeMultipartUpload(data);
  }

  async abortMultipartUpload(data) {
    return this.provider.abortMultipartUpload(data);
  }

  /*
   |--------------------------------------------------------------------------
   | Health & Monitoring
   |--------------------------------------------------------------------------
   */

  async health() {
    return this.provider.health();
  }

  /*
   |--------------------------------------------------------------------------
   | Provider Capabilities
   |--------------------------------------------------------------------------
   */

  capabilities() {
    return this.provider.capabilities();
  }
}

module.exports = StorageService;
