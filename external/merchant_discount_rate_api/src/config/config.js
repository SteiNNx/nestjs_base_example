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
    acronimoPieza: 'MERCHANT_DISCOUNT_RATE_API',
    prefixApi: process.env.EXTERNAL_API_MDR_PREFIX_ENDPOINTS || '/ms/mdr/v1',
    port: process.env.EXTERNAL_API_MDR_PORT || 3003,

    auth: {
      privateKeyPath: path.resolve(process.env.EXTERNAL_API_MDR_AUTH_PRIVATE_KEY_PATH),
      publicKeyPath: path.resolve(process.env.EXTERNAL_API_MDR_AUTH_PUBLIC_KEY_PATH),

      headerSecurityKey: process.env.EXTERNAL_API_MDR_HEADER_SECURITY_KEY,

      tokenExpiresIn: process.env.EXTERNAL_API_MDR_AUTH_TOKEN_EXPIRES_IN || '1h',
      jwtAlgorithm: process.env.EXTERNAL_API_MDR_AUTH_JWT_ALGORITHM || 'RS256',
    },
  },
};
