// src/helpers/jsonwebtoken.helper.js

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const { getAuthConfig } = require('../providers/credentials.provider.js');
const TechnicalError = require('../exceptions/technical.exception');

const LoggerHelper = require('./logger.helper');
const logger = new LoggerHelper('jsonwebtoken.helper');

/**
 * Genera un token JWT usando el payload y la configuración de autenticación.
 *
 * @function generateToken
 * @param {Object} payload - Información a incluir en el token (claims).
 * @param {String} jwtSubjectIdentifier - Identificador para el "subject" del token (p. ej. "userId").
 * @param {Object} [options={}] - Opciones adicionales para la generación del token (p. ej. notBefore).
 * @returns {String} El token JWT firmado.
 * @throws {TechnicalError} Si ocurre algún problema al firmar el token.
 */
const generateToken = (payload, jwtSubjectIdentifier, options = {}) => {
    try {
        logger.info('Generando token JWT con parámetros configurados.');
        const {
            privateKey,
            tokenExpiresIn,
            jwtAlgorithm,
            jwtAudience,
            jwtIssuer,
        } = getAuthConfig();

        // Opciones predeterminadas y necesarias para la firma del JWT
        const signOptions = {
            algorithm: jwtAlgorithm,     // RS256, HS256, etc.
            expiresIn: tokenExpiresIn,   // Determina la caducidad (ejemplo: "1h")
            audience: jwtAudience,       // Para quién está destinado el token
            issuer: jwtIssuer,           // Quién emite el token
            subject: jwtSubjectIdentifier, // "Subject" del token, por ejemplo el id de usuario
            jwtid: uuidv4(),            // Identificador único del token (evita replay attacks)
            ...options,
        };

        // Firma del token con la clave privada y las opciones definidas
        const token = jwt.sign(payload, privateKey, signOptions);

        logger.info('Token JWT generado correctamente.');
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
        const {
            publicKey,
            jwtAlgorithm,
            jwtAudience,
            jwtIssuer,
        } = getAuthConfig();

        const verifyOptions = {
            algorithms: [jwtAlgorithm],   // Asegura que sea el algoritmo esperado
            audience: jwtAudience,
            issuer: jwtIssuer,
            ...options,
        };

        const decoded = jwt.verify(
            token,
            publicKey,
            verifyOptions,
        );

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
