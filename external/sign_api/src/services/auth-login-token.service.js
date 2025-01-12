// src/services/auth-login-token.service.js

/**
 * Servicio para generar el token JWT en el proceso de autenticación.
 * Valida las credenciales recibidas (sólo acepta usuario "test" y password "test") y genera un token.
 *
 * @module authLoginTokenService
 */

const { generateToken } = require('../helpers/jsonwebtoken.helper');
const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('auth-login-token.service');

/**
 * Valida las credenciales y retorna un token JWT si son correctas.
 *
 * @async
 * @function loginToken
 * @param {Object} credentials - Objeto con las propiedades "username" y "password".
 * @returns {Promise<String>} Token JWT firmado.
 * @throws {Error} Si las credenciales son inválidas.
 */
const loginToken = async (credentials) => {
    logger.info('[auth-login-token.service] Iniciando validación de credenciales');

    const { username, password } = credentials;

    // ============================================================================
    // Validación de credenciales: se acepta solo el usuario y password "test"
    // ============================================================================
    if (username === 'test' && password === 'test') {
        logger.info('[auth-login-token.service] Credenciales válidas');

        // ==============================================================================
        // Construir el payload del token
        // ==============================================================================
        const payload = { username: 'test', role: 'user' };

        // ==============================================================================
        // Generar el token JWT usando el helper
        // ==============================================================================
        const token = generateToken(payload);
        logger.info('[auth-login-token.service] Token generado correctamente');
        return token;
    } else {
        logger.error('[auth-login-token.service] Credenciales inválidas');
        throw new Error('Credenciales inválidas');
    }
};

module.exports = { loginToken };
