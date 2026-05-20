const {
  S3Client,

  GetObjectCommand,

  PutObjectCommand,

  DeleteObjectCommand,

  ListObjectsV2Command,

  HeadObjectCommand,

  CopyObjectCommand,

  CreateMultipartUploadCommand,

  UploadPartCommand,

  CompleteMultipartUploadCommand,

  AbortMultipartUploadCommand,

  HeadBucketCommand,

  CreateBucketCommand,
} = require("@aws-sdk/client-s3");

const { Upload } = require("@aws-sdk/lib-storage");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const config = require("../config/storage.config");

const retry = require("../utils/retry.util");

const UploadValidator = require("../validators/upload.validator");

const storageEvents = require("../events/storage.events");

const {
  MULTIPART_THRESHOLD,

  DEFAULT_PART_SIZE,

  DEFAULT_QUEUE_SIZE,
} = require("../constants/upload.constants");

class S3CompatibleProvider {
  constructor() {
    this.bucket = config.s3.bucket;

    const clientConfig = {
      region: config.s3.region,

      forcePathStyle: config.s3.forcePathStyle,
    };

    /*
     |--------------------------------------------------------------------------
     | Optional Endpoint
     |--------------------------------------------------------------------------
     */

    if (config.s3.endpoint) {
      clientConfig.endpoint = config.s3.endpoint;
    }

    /*
     |--------------------------------------------------------------------------
     | Optional Credentials
     |--------------------------------------------------------------------------
     */

    if (config.s3.accessKey) {
      clientConfig.credentials = {
        accessKeyId: config.s3.accessKey,

        secretAccessKey: config.s3.secretKey,
      };

      /*
       |--------------------------------------------------------------------------
       | Optional Session Token
       |--------------------------------------------------------------------------
       */

      if (config.s3.sessionToken) {
        clientConfig.credentials.sessionToken = config.s3.sessionToken;
      }
    }

    this.client = new S3Client(clientConfig);

    /*
     |--------------------------------------------------------------------------
     | Optional Auto Bucket Creation
     |--------------------------------------------------------------------------
     */

    if (config.s3.autoCreateBucket) {
      this.initializeBucket();
    }
  }

  /*
   |--------------------------------------------------------------------------
   | Initialize Bucket
   |--------------------------------------------------------------------------
   */

  async initializeBucket() {
    try {
      await this.health();
    } catch {
      await this.client.send(
        new CreateBucketCommand({
          Bucket: this.bucket,
        }),
      );
    }
  }

  /*
   |--------------------------------------------------------------------------
   | Upload
   |--------------------------------------------------------------------------
   */

  async upload({
    key,

    body,

    contentType,

    metadata = {},

    onProgress,
  }) {
    UploadValidator.validate({
      key,
      body,
    });

    return retry(async () => {
      const upload = new Upload({
        client: this.client,

        params: {
          Bucket: this.bucket,

          Key: key,

          Body: body,

          ContentType: contentType,

          Metadata: metadata,
        },

        queueSize: DEFAULT_QUEUE_SIZE,

        partSize: DEFAULT_PART_SIZE,

        leavePartsOnError: false,
      });

      /*
         |--------------------------------------------------------------------------
         | Upload Progress
         |--------------------------------------------------------------------------
         */

      upload.on(
        "httpUploadProgress",

        (progress) => {
          if (onProgress) {
            onProgress(progress);
          }

          storageEvents.emit(
            "upload-progress",

            {
              key,

              progress,
            },
          );
        },
      );

      const result = await upload.done();

      storageEvents.emit(
        "upload-complete",

        {
          key,

          result,
        },
      );

      return result;
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Download Stream
   |--------------------------------------------------------------------------
   */

  async download(key) {
    return retry(async () => {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,

          Key: key,
        }),
      );

      return response.Body;
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Delete
   |--------------------------------------------------------------------------
   */

  async delete(key) {
    return retry(async () => {
      return this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,

          Key: key,
        }),
      );
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Exists
   |--------------------------------------------------------------------------
   */

  async exists(key) {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,

          Key: key,
        }),
      );

      return true;
    } catch {
      return false;
    }
  }

  /*
   |--------------------------------------------------------------------------
   | List
   |--------------------------------------------------------------------------
   */

  async list(prefix = "") {
    return retry(async () => {
      return this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,

          Prefix: prefix,
        }),
      );
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Copy
   |--------------------------------------------------------------------------
   */

  async copy(
    sourceKey,

    destinationKey,
  ) {
    return retry(async () => {
      return this.client.send(
        new CopyObjectCommand({
          Bucket: this.bucket,

          CopySource: `${this.bucket}/${sourceKey}`,

          Key: destinationKey,
        }),
      );
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Move
   |--------------------------------------------------------------------------
   */

  async move(
    sourceKey,

    destinationKey,
  ) {
    await this.copy(
      sourceKey,

      destinationKey,
    );

    await this.delete(sourceKey);
  }

  /*
   |--------------------------------------------------------------------------
   | Upload Signed URL
   |--------------------------------------------------------------------------
   */

  async getUploadSignedUrl({
    key,

    contentType,

    expiresIn = 3600,
  }) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,

      Key: key,

      ContentType: contentType,
    });

    return getSignedUrl(
      this.client,

      command,

      {
        expiresIn,
      },
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Download Signed URL
   |--------------------------------------------------------------------------
   */

  async getDownloadSignedUrl(
    key,

    expiresIn = 3600,
  ) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,

      Key: key,
    });

    return getSignedUrl(
      this.client,

      command,

      {
        expiresIn,
      },
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Multipart Upload Initialization
   |--------------------------------------------------------------------------
   */

  async createMultipartUpload({
    key,

    contentType,
  }) {
    return this.client.send(
      new CreateMultipartUploadCommand({
        Bucket: this.bucket,

        Key: key,

        ContentType: contentType,
      }),
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Multipart Signed URL
   |--------------------------------------------------------------------------
   */

  async getMultipartUploadSignedUrl({
    key,

    uploadId,

    partNumber,

    expiresIn = 3600,
  }) {
    const command = new UploadPartCommand({
      Bucket: this.bucket,

      Key: key,

      UploadId: uploadId,

      PartNumber: partNumber,
    });

    return getSignedUrl(
      this.client,

      command,

      {
        expiresIn,
      },
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Complete Multipart Upload
   |--------------------------------------------------------------------------
   */

  async completeMultipartUpload({
    key,

    uploadId,

    parts,
  }) {
    return this.client.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.bucket,

        Key: key,

        UploadId: uploadId,

        MultipartUpload: {
          Parts: parts,
        },
      }),
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Abort Multipart Upload
   |--------------------------------------------------------------------------
   */

  async abortMultipartUpload({
    key,

    uploadId,
  }) {
    return this.client.send(
      new AbortMultipartUploadCommand({
        Bucket: this.bucket,

        Key: key,

        UploadId: uploadId,
      }),
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Health Check
   |--------------------------------------------------------------------------
   */

  async health() {
    await this.client.send(
      new HeadBucketCommand({
        Bucket: this.bucket,
      }),
    );

    return true;
  }

  /*
   |--------------------------------------------------------------------------
   | Provider Capabilities
   |--------------------------------------------------------------------------
   */

  capabilities() {
    return {
      provider: "s3-compatible",

      multipart: true,

      signedUrls: true,

      streaming: true,

      integrityCheck: true,

      bucketAutoCreate: true,

      minioCompatible: true,
    };
  }
}

module.exports = S3CompatibleProvider;
