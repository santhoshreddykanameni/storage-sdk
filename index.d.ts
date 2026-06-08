declare module "@santhoshk382/storage-sdk" {
  /*
   |--------------------------------------------------------------------------
   | Upload Progress
   |--------------------------------------------------------------------------
   */

  export interface UploadProgress {
    loaded: number;

    total?: number;
  }

  /*
   |--------------------------------------------------------------------------
   | Upload Options
   |--------------------------------------------------------------------------
   */

  export interface UploadOptions {
    key: string;

    body: any;

    contentType?: string;

    metadata?: Record<string, string>;

    acl?: string;

    onProgress?: (progress: UploadProgress) => void;
  }

  /*
   |--------------------------------------------------------------------------
   | Multipart Part
   |--------------------------------------------------------------------------
   */

  export interface MultipartPart {
    PartNumber: number;

    ETag: string;
  }

  /*
   |--------------------------------------------------------------------------
   | Multipart Upload Options
   |--------------------------------------------------------------------------
   */

  export interface MultipartUploadOptions {
    key: string;

    contentType?: string;

    metadata?: Record<string, string>;

    acl?: string;
  }

  /*
   |--------------------------------------------------------------------------
   | Multipart Signed URL
   |--------------------------------------------------------------------------
   */

  export interface MultipartSignedUrlOptions {
    key: string;

    uploadId: string;

    partNumber: number;

    expiresIn?: number;
  }

  /*
   |--------------------------------------------------------------------------
   | Complete Multipart Upload
   |--------------------------------------------------------------------------
   */

  export interface CompleteMultipartUploadOptions {
    key: string;

    uploadId: string;

    parts: MultipartPart[];
  }

  /*
   |--------------------------------------------------------------------------
   | Storage SDK
   |--------------------------------------------------------------------------
   */

  export interface StorageSDK {
    /*
     |--------------------------------------------------------------------------
     | Basic Operations
     |--------------------------------------------------------------------------
     */

    upload(options: UploadOptions): Promise<any>;

    download(key: string): Promise<any>;

    delete(key: string): Promise<any>;

    exists(key: string): Promise<boolean>;

    list(prefix?: string): Promise<any>;

    copy(source: string, destination: string): Promise<any>;

    move(source: string, destination: string): Promise<any>;

    /*
     |--------------------------------------------------------------------------
     | Signed URLs
     |--------------------------------------------------------------------------
     */

    getUploadSignedUrl(data: {
      key: string;

      contentType?: string;

      expiresIn?: number;

      acl?: string;
    }): Promise<string>;

    getDownloadSignedUrl(
      key: string,

      expiresIn?: number,
    ): Promise<string>;

    /*
     |--------------------------------------------------------------------------
     | Multipart Upload
     |--------------------------------------------------------------------------
     */

    createMultipartUpload(data: MultipartUploadOptions): Promise<any>;

    getMultipartUploadSignedUrl(
      data: MultipartSignedUrlOptions,
    ): Promise<string>;

    completeMultipartUpload(data: CompleteMultipartUploadOptions): Promise<any>;

    abortMultipartUpload(data: {
      key: string;

      uploadId: string;
    }): Promise<any>;

    /*
     |--------------------------------------------------------------------------
     | Health
     |--------------------------------------------------------------------------
     */

    health(): Promise<any>;

    /*
     |--------------------------------------------------------------------------
     | Capabilities
     |--------------------------------------------------------------------------
     */

    capabilities(): any;
  }

  const storage: StorageSDK;

  export = storage;
}
