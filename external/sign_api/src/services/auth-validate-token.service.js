// src/services/auth-validate-token.service.js

/**
 * Servicio para validar un token JWT.
 *
 * @module authValidateTokenService
 */

const { validateToken } = require('../helpers/jsonwebtoken.helper');
const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('auth-validate-token.service');

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
  logger.info('[auth-validate-token.service] Iniciando validación del token');
  const decoded = validateToken(token);
  logger.info('[auth-validate-token.service] Token validado correctamente');
  return decoded;
};

module.exports = { authValidateTokenService };
