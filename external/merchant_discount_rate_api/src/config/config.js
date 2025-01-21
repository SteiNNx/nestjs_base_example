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

    dynamoDb: {
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      awsRegion: process.env.AWS_REGION,

      dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT,// process.env.DYNAMODB_ENDPOINT,
      dynamoDbPort: process.env.DYNAMODB_PORT,
      dynamoDbMaxAttempts: process.env.DYNAMODB_RETRY,
      dynamoDbConnectionTimeOut: parseInt(process.env.DYNAMODB_CONNECTION_TIMEOUT),

      tableNameUsers: process.env.DYNAMODB_TABLE_NAME_USERS || 'users',

      tableNameMdrAmex: process.env.DYNAMODB_TABLE_NAME_MDR_AMEX || 'mdr_amex',
      tableNameMdrDiscover: process.env.DYNAMODB_TABLE_NAME_MDR_DISCOVER || 'mdr_discover',
      tableNameMdrMastercard: process.env.DYNAMODB_TABLE_NAME_MDR_MASTERCARD || 'mdr_mastercard',
      tableNameMdrVisa: process.env.DYNAMODB_TABLE_NAME_MDR_VISA || 'mdr_visa',
    }
  },
};
