const { randomBytes } = require("crypto");

function safeRandomString(length) {
  // Roughly equivalent to shell `openssl rand -base64 30 | tr '+/' '-_'`
  return randomBytes(length)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function hexRandomString(length) {
  return randomBytes(length).toString("hex");
}

exports.safeRandomString = safeRandomString;
exports.hexRandomString = hexRandomString;
