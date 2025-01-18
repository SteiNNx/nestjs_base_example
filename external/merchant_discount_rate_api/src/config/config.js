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
    prefixApi: process.env.EXTERNAL_API_MDR_PREFIX_ENDPOINTS || 'ms/v1/sign',
    port: process.env.EXTERNAL_API_SIGN_PORT || 3002,

    auth: {
      privateKeyPath: path.resolve(process.env.EXTERNAL_API_SIGN_AUTH_PRIVATE_KEY_PATH),
      publicKeyPath: path.resolve(process.env.EXTERNAL_API_SIGN_AUTH_PUBLIC_KEY_PATH),

      headerSecurityKey: process.env.EXTERNAL_API_SIGN_HEADER_SECURITY_KEY,

      tokenExpiresIn: process.env.EXTERNAL_API_AUTH_TOKEN_EXPIRES_IN || '1h',
      jwtAlgorithm: process.env.EXTERNAL_API_AUTH_JWT_ALGORITHM || 'RS256',
    },

    sign: {
      privateKeyPath: path.resolve(process.env.EXTERNAL_API_SIGN_PRIVATE_KEY_PATH),
      certificatePath: path.resolve(process.env.EXTERNAL_API_SIGN_CERTIFICATE_PATH),

      canonicalizationAlgorithm: process.env.EXTERNAL_API_SIGN_CONFIG_CANONICALIZATION_ALGORITHM || 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
      signatureAlgorithm: process.env.EXTERNAL_API_SIGN_CONFIG_SIGNATURE_ALGORITHM || 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',

      referenceTransformsFirst: process.env.EXTERNAL_API_SIGN_REFERENCES_TRANSFORMS_XML_DSIG || 'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      referenceDigestAlgorithm: process.env.EXTERNAL_API_SIGN_REFERENCES_DIGEST_ALGORITHM || 'http://www.w3.org/2001/04/xmlenc#sha256',
    }
  },
};
