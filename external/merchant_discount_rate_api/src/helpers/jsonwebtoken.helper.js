// src/helpers/jsonwebtoken.helper.js

const jwt = require('jsonwebtoken');
const { getAuthConfig } = require('../providers/credentials.provider.js');
const TechnicalError = require('../exceptions/technical.exception');
const LoggerHelper = require('./logger.helper');

const logger = new LoggerHelper('jsonwebtoken.helper');

/**
 * Genera un token JWT usando el payload y la configuración de autenticación.
 *
 * @function generateToken
 * @param {Object} payload - La información a incluir en el token.
 * @param {Object} [options={}] - Opciones adicionales para la generación del token.
 * @returns {String} Token JWT firmado.
 * @throws {TechnicalError} Si ocurre algún problema al firmar el token.
 */
const generateToken = (payload, options = {}) => {
    try {
        logger.info('Generando token JWT.');
        const { privateKey, tokenExpiresIn, jwtAlgorithm } = getAuthConfig();
        const signOptions = {
            // expiresIn: tokenExpiresIn,
            algorithm: jwtAlgorithm,
            ...options
        };
        const token = jwt.sign(payload, privateKey, signOptions);
        logger.info('Token generado correctamente.');
        return token;
    } catch (error) {
        logger.error(`Error generando token: ${error.message}`);
        throw new TechnicalError('JWT.GENERATION_ERROR', 'Error al generar el token JWT.', 500, error);
    }
};

/**
 * Valida un token JWT utilizando la configuración de autenticación.
 *
 * @function validateToken
 * @param {String} token - El token JWT a validar.
 * @param {Object} [options={}] - Opciones adicionales para la validación del token.
 * @returns {Object} El payload decodificado del token.
 * @throws {TechnicalError} Si el token es inválido o ha expirado.
 */
const validateToken = (token, options = {}) => {
    try {
        logger.info('Validando token JWT.');
        const { publicKey, jwtAlgorithm } = getAuthConfig();
        const verifyOptions = {
            algorithms: [jwtAlgorithm],
            ...options
        };
        const decoded = jwt.verify(token, publicKey, verifyOptions);
        logger.info('Token validado correctamente.');
        return decoded;
    } catch (error) {
        logger.error(`Error validando token: ${error.message}`);
        throw new TechnicalError('JWT.VALIDATION_ERROR', 'Error al validar el token JWT.', 401, error);
    }
};

module.exports = {
    generateToken,
    validateToken,
};
