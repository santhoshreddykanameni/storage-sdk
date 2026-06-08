# storage-sdk

storage-sdk is a reusable and extensible object storage abstraction library for Node.js applications.

The SDK is designed for:

- cloud deployments
- on-prem deployments
- hybrid infrastructure
- reusable platform engineering

Enterprise-ready storage SDK for:

- AWS S3
- MinIO
- Local Storage

Supports:

- Multipart uploads
- Parallel uploads
- Signed URLs
- Large file uploads
- Download streaming
- Upload progress
- Enterprise telemetry ingestion workflows

---

# Installation

```bash
npm install @orbit-stream/storage
```

---

# Environment Variables

## AWS S3

```env
STORAGE_PROVIDER=s3-compatible

S3_REGION=us-east-1

S3_BUCKET=my-bucket

S3_ACCESS_KEY=your-access-key

S3_SECRET_KEY=your-secret-key
```

---

## MinIO

```env
STORAGE_PROVIDER=s3-compatible

S3_REGION=us-east-1

S3_BUCKET=my-bucket

S3_ENDPOINT=http://localhost:9000

S3_FORCE_PATH_STYLE=true

S3_ACCESS_KEY=minioadmin

S3_SECRET_KEY=minioadmin
```

---

# Basic Usage

```js
const storage = require("@orbit-stream/storage");
```

---

# Upload File

```js
const fs = require("fs");

await storage.upload({
  key: "documents/test.zip",

  body: fs.createReadStream("./test.zip"),

  contentType: "application/zip",
});
```

---

# Upload With Progress

```js
const fs = require("fs");

let lastLogged = null;

await storage.upload({
  key: "documents/test.zip",

  body: fs.createReadStream("./test.zip"),

  contentType: "application/zip",

  onProgress: (progress) => {
    const uploaded = (progress.loaded / 1024 / 1024 / 1024).toFixed(1);

    if (uploaded !== lastLogged) {
      lastLogged = uploaded;

      console.log(`Uploaded ${uploaded} GB`);
    }
  },
});
```

---

# Download File

```js
const fs = require("fs");

const response = await storage.download("documents/test.zip");

const writeStream = fs.createWriteStream("./downloaded.zip");

response.Body.pipe(writeStream);
```

---

# Check File Exists

```js
const exists = await storage.exists("documents/test.zip");

console.log(exists);
```

---

# Delete File

```js
await storage.delete("documents/test.zip");
```

---

# List Files

```js
const files = await storage.list("documents/");

console.log(files);
```

---

# Generate Upload Signed URL

```js
const signedUrl = await storage.getUploadSignedUrl({
  key: "documents/test.zip",

  contentType: "application/zip",

  expiresIn: 3600,
});

console.log(signedUrl);
```

---

# Upload Using Signed URL

```js
const axios = require("axios");

const fs = require("fs");

const stream = fs.createReadStream("./test.zip");

await axios.put(
  signedUrl,

  stream,

  {
    headers: {
      "Content-Type": "application/zip",
    },
  },
);
```

---

# Generate Download Signed URL

```js
const downloadUrl = await storage.getDownloadSignedUrl(
  "documents/test.zip",

  3600,
);

console.log(downloadUrl);
```

---

# Multipart Upload

## Create Multipart Upload

```js
const multipart = await storage.createMultipartUpload({
  key: "documents/large.zip",

  contentType: "application/zip",
});

console.log(multipart.UploadId);
```

---

# Generate Multipart Signed URL

```js
const signedUrl = await storage.getMultipartUploadSignedUrl({
  key: "documents/large.zip",

  uploadId: multipart.UploadId,

  partNumber: 1,
});
```

---

# Complete Multipart Upload

```js
await storage.completeMultipartUpload({
  key: "documents/large.zip",

  uploadId: multipart.UploadId,

  parts: [
    {
      PartNumber: 1,

      ETag: '"etag"',
    },
  ],
});
```

---

# Abort Multipart Upload

```js
await storage.abortMultipartUpload({
  key: "documents/large.zip",

  uploadId: multipart.UploadId,
});
```

---

# Health Check

```js
const health = await storage.health();

console.log(health);
```

---

# Provider Capabilities

```js
console.log(storage.capabilities());
```

---

# Supported Providers

| Provider      | Supported |
| ------------- | --------- |
| AWS S3        | ✅        |
| MinIO         | ✅        |
| Local Storage | ✅        |

---

# Enterprise Features

- Multipart uploads
- Parallel uploads
- Signed URLs
- Streaming downloads
- Upload progress tracking
- Retry support
- MinIO compatible
- AWS S3 compatible
- Large file support
- Kubernetes friendly
- Telemetry ingestion ready

---

# Recommended Multipart Upload Settings

| File Size | Recommended                 |
| --------- | --------------------------- |
| <1GB      | Single Upload               |
| 1GB–10GB  | Multipart Upload            |
| >10GB     | Multipart + Parallel Upload |

---

# License

MIT
