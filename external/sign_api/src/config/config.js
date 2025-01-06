// src/config.js
require('dotenv').config();
const path = require('path');

module.exports = {
    config: {
        prefixApi: process.env.EXTERNAL_API_SIGN_PREFIX_ENDPOINTS || 'ms/v1/sign',
        port: process.env.EXTERNAL_API_SIGN_PORT || 3002,
        privateKeyPath: path.resolve(process.env.EXTERNAL_API_SIGN_PRIVATE_KEY_PATH),
        certificatePath: path.resolve(process.env.EXTERNAL_API_SIGN_CERTIFICATE_PATH),
    }
};
