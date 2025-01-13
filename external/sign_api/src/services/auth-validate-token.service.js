// src/services/auth-validate-token.service.js

const { validateToken } = require('../helpers/jsonwebtoken.helper');
const { handleThrownError } = require('../providers/error-handler.provider');

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('auth-validate-token.service.js');

/**
 * Valida un token JWT y retorna el payload decodificado.
 *
 * @async
 * @function authValidateTokenService
 * @param {String} token - El token JWT a validar.
 * @returns {Promise<Object>} El payload decodificado.
 * @throws {TechnicalError} Si el token es inválido o ha expirado.
 */
const authValidateTokenService = async (token) => {
  try {
    logger.info('Iniciando validación del token');
    const decoded = validateToken(token);
    logger.info('Token validado correctamente');
    return decoded;
  } catch (error) {
    logger.error('Error al validar el token', { error: error.message });
    // Lanza el error utilizando handleThrownError
    handleThrownError(error, 'AUTH.VALIDATE.0001', 'Error al validar el token JWT.');
  }
};

module.exports = { authValidateTokenService };
