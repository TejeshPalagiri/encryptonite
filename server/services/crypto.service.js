const config = require("../config/config");
const crypto = require("crypto");

const outputEncoding = "hex";

const encrypt = (payload) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const key = crypto
    .createHash("sha256")
    .update(String(config.CRYPTO_KEY))
    .digest("base64")
    .substr(0, 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(payload);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString(outputEncoding) + ":" + encrypted.toString(outputEncoding);
};

const decrypt = (text) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), outputEncoding);
  const encryptedText = Buffer.from(textParts.join(":"), outputEncoding);
  const key = crypto
    .createHash("sha256")
    .update(String(config.CRYPTO_KEY))
    .digest("base64")
    .substr(0, 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const encryptWithSalt = (payload, salt) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const key = crypto
    .createHash("sha256")
    .update(String(salt))
    .digest("base64")
    .substr(0, 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(payload);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString(outputEncoding) + ":" + encrypted.toString(outputEncoding);
}

const decryptWithSalt = (text, salt) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), outputEncoding);
  const encryptedText = Buffer.from(textParts.join(":"), outputEncoding);
  const key = crypto
    .createHash("sha256")
    .update(String(salt))
    .digest("base64")
    .substr(0, 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const generateRandomId = () => {
  return crypto.randomBytes(4).toString("hex");
};

const len6RandomId = () => {
  return crypto.randomBytes(3).toString("hex");
};

module.exports = {
  encrypt,
  decrypt,
  generateRandomId,
  len6RandomId,
  encryptWithSalt,
  decryptWithSalt
};
