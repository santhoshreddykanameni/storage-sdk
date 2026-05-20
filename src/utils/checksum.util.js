const crypto = require("crypto");

function generateMD5(buffer) {
  return crypto.createHash("md5").update(buffer).digest("base64");
}

module.exports = {
  generateMD5,
};
