// src/providers/credentials.provider.js

const fs = require('fs');
const { config } = require('../config/config.js');

const AdapterError = require('../exceptions/adapter.exception');
const TechnicalError = require('../exceptions/technical.exception');
const LoggerHelper = require('../helpers/logger.helper.js');

const logger = new LoggerHelper('credentials.provider');

/**
 * Carga las credenciales de autenticación (privateKey y publicKey) y la configuración asociada.
 *
 * @function getAuthConfig
 * @returns {Object} Objeto con las propiedades:
 *  - privateKey {String}: Clave privada de autenticación.
 *  - publicKey {String}: Clave pública de autenticación.
 *  - tokenExpiresIn {String}: Tiempo de expiración del token.
 *  - jwtAlgorithm {String}: Algoritmo de firma del token.
 * @throws {AdapterError} Si ocurre un error al leer alguno de los archivos.
 * @throws {TechnicalError} Si alguna de las llaves está vacía o ilegible.
 */
const getAuthConfig = () => {
    const { privateKeyPath, publicKeyPath, tokenExpiresIn, jwtAlgorithm } = config.auth;
    let privateKey = null;
    let publicKey = null;

    try {
        privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
        publicKey = fs.readFileSync(publicKeyPath, 'utf-8');
    } catch (error) {
        logger.error('[getAuthConfig] Error al leer llaves de autenticación: ' + error.message);
        throw new AdapterError(
            'AUTH.KEY_PEM_FILE_READ_ERROR',
            'Error al leer las llaves de autenticación.',
            502,
            error
        );
    }

    if (!privateKey || !privateKey.trim()) {
        logger.error('[getAuthConfig] La llave privada de autenticación está vacía o ilegible.');
        throw new TechnicalError(
            'AUTH.INVALID_PRIVATE_KEY_PEM_FILE',
            'La llave privada de autenticación está vacía o no se pudo leer correctamente.',
            500
        );
    }
    if (!publicKey || !publicKey.trim()) {
        logger.error('[getAuthConfig] La llave pública de autenticación está vacía o ilegible.');
        throw new TechnicalError(
            'AUTH.INVALID_PUBLIC_KEY_PEM_FILE',
            'La llave pública de autenticación está vacía o no se pudo leer correctamente.',
            500
        );
    }

    return { privateKey, publicKey, tokenExpiresIn, jwtAlgorithm };
};

/**
 * Retorna la clave de seguridad para el header de seguridad.
 *
 * @function getSecurityKey
 * @returns {String} La clave de seguridad definida en config.auth.headerSecurityKey.
 * @throws {TechnicalError} Si la clave de seguridad no se encuentra o es vacía.
 */
const getSecurityKey = () => {
    const securityKey = config.auth.headerSecurityKey;
    if (!securityKey || !securityKey.trim()) {
        logger.error('[getSecurityKey] La clave de seguridad está vacía o no se encontró.');
        throw new TechnicalError(
            'AUTH.INVALID_SECURITY_KEY',
            'La clave de seguridad de autenticación está vacía o no se encontró.',
            500
        );
    }
    return securityKey;
};

/**
 * Carga y valida la configuración de DynamoDB desde la sección 'dynamoDb' de la configuración.
 *
 * @function getDynamoDbConfig
 * @returns {Object} Un objeto con las siguientes propiedades:
 *  - awsAccessKeyId {String}: Clave de acceso AWS.
 *  - awsSecretAccessKey {String}: Clave secreta de AWS.
 *  - awsRegion {String}: Región de AWS.
 *  - dynamoDbEndpoint {String}: Endpoint de DynamoDB.
 *  - dynamoDbPort {String}: Puerto utilizado para conectarse a DynamoDB.
 * @throws {TechnicalError} Si alguna de las variables requeridas está vacía o no definida.
 */
const getDynamoDbConfig = () => {
    const {
        awsAccessKeyId,
        awsSecretAccessKey,
        awsRegion,
        dynamoDbEndpoint,
        dynamoDbPort,
        dynamoDbMaxAttempts,
        dynamoDbConnectionTimeOut,
    } = config.dynamoDb;

    if (!awsAccessKeyId || !awsAccessKeyId.trim()) {
        logger.error('[getDynamoDbConfig] awsAccessKeyId está vacía o no definida.');
        throw new TechnicalError(
            'DYNAMODB.INVALID_AWS_ACCESS_KEY_ID',
            'awsAccessKeyId está vacía o no definida.',
            500
        );
    }
    if (!awsSecretAccessKey || !awsSecretAccessKey.trim()) {
        logger.error('[getDynamoDbConfig] awsSecretAccessKey está vacía o no definida.');
        throw new TechnicalError(
            'DYNAMODB.INVALID_AWS_SECRET_ACCESS_KEY',
            'awsSecretAccessKey está vacía o no definida.',
            500
        );
    }
    if (!awsRegion || !awsRegion.trim()) {
        logger.error('[getDynamoDbConfig] awsRegion está vacía o no definida.');
        throw new TechnicalError(
            'DYNAMODB.INVALID_AWS_REGION',
            'awsRegion está vacía o no definida.',
            500
        );
    }
    if (!dynamoDbEndpoint || !dynamoDbEndpoint.trim()) {
        logger.error('[getDynamoDbConfig] dynamoDbEndpoint está vacía o no definida.');
        throw new TechnicalError(
            'DYNAMODB.INVALID_ENDPOINT',
            'dynamoDbEndpoint está vacía o no definida.',
            500
        );
    }
    if (!dynamoDbPort || !dynamoDbPort.trim()) {
        logger.error('[getDynamoDbConfig] dynamoDbPort está vacía o no definida.');
        throw new TechnicalError(
            'DYNAMODB.INVALID_PORT',
            'dynamoDbPort está vacía o no definida.',
            500
        );
    }
    if (!dynamoDbMaxAttempts || !dynamoDbMaxAttempts.trim()) {
        logger.error('[getDynamoDbConfig] dynamoDbMaxAttempts está vacía o no definida.');
        throw new TechnicalError(
            'DYNAMODB.INVALID_MAX_ATTEMPTS',
            'dynamoDbMaxAttempts está vacía o no definida.',
            500
        );
    }
    if (!dynamoDbConnectionTimeOut || !dynamoDbConnectionTimeOut.trim()) {
        logger.error('[getDynamoDbConfig] dynamoDbConnectionTimeOut está vacía o no definida.');
        throw new TechnicalError(
            'DYNAMODB.CONNECTION_TIME_OUT',
            'dynamoDbConnectionTimeOut está vacía o no definida.',
            500
        );
    }

    return {
        awsAccessKeyId,
        awsSecretAccessKey,
        awsRegion,
        dynamoDbEndpoint,
        dynamoDbPort,
        dynamoDbMaxAttempts,
        dynamoDbConnectionTimeOut,
    };
};

module.exports = {
    getAuthConfig,
    getSecurityKey,
    getDynamoDbConfig
};
