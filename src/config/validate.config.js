const Joi = require("joi");

const schema = Joi.object({
  STORAGE_PROVIDER: Joi.string().required(),

  S3_BUCKET: Joi.string().required(),
}).unknown();

const { error } = schema.validate(process.env);

if (error) {
  throw new Error(`Config Validation Error: ${error.message}`);
}
