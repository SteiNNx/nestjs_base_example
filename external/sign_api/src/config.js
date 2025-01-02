// src/config.js
require('dotenv').config();
const path = require('path');

module.exports = {
    port: process.env.EXTERNAL_API_SIGN_PORT || 3001,
    privateKeyPath: path.resolve(process.env.EXTERNAL_API_SIGN_PRIVATE_KEY_PATH),
    certificatePath: path.resolve(process.env.EXTERNAL_API_SIGN_CERTIFICATE_PATH),
};
