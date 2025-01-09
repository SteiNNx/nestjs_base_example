// src/config/config.js

/**
 * Configuración principal de la aplicación mediante variables de entorno.
 *
 * @module config
 */

require('dotenv').config();
const path = require('path');

module.exports = {
  config: {
    acronimoPieza: 'SIGN',
    prefixApi: process.env.EXTERNAL_API_SIGN_PREFIX_ENDPOINTS || 'ms/v1/sign',
    port: process.env.EXTERNAL_API_SIGN_PORT || 3002,

    headerSecurityKey: process.env.EXTERNAL_API_HEADER_SECURITY_KEY,
    headerSecurityIv: process.env.EXTERNAL_API_HEADER_SECURITY_IV,

    privateKeyPath: path.resolve(process.env.EXTERNAL_API_SIGN_PRIVATE_KEY_PATH),
    certificatePath: path.resolve(process.env.EXTERNAL_API_SIGN_CERTIFICATE_PATH),
  },
};
