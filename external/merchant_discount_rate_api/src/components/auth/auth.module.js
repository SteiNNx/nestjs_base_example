// src/components/auth/auth.module.js

/**
 * Módulo de autenticación.
 * Contiene la lógica para el login, la validación y el refresco del token JWT.
 *
 * @module authModule
 */

const { loginToken } = require('../../services/auth-login-token.service');
const {
  authValidateTokenService
} = require('../../services/auth-validate-token.service');
const {
  refreshTokenService
} = require('../../services/auth-refresh-token.service');  // Nuevo servicio que podemos crear

const AuthError = require('../../exceptions/auth.exception');
const validateBodySchema = require('../../helpers/validate.helper');
const authLoginTokenSchema = require('../../schemas/request/auth-login-token.schema');
const authValidateTokenSchema = require('../../schemas/request/auth-validate-token.schema');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('auth.module.js');

/**
 * Realiza la autenticación (login) extrayendo las credenciales del body de la solicitud.
 *
 * @async
 * @function authLoginModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<String>} Token JWT firmado.
 * @throws {Error} Si las credenciales son inválidas.
 */
const authLoginModule = async (req) => {
  logger.info('Inicio de autenticación (login)');

  logger.info('Validando el esquema del cuerpo de la solicitud');
  validateBodySchema(req.body, authLoginTokenSchema, 'XXX.XXX.0001');
  logger.info('Esquema validado correctamente');

  // Extraer las credenciales del body
  const credentials = req.body;

  // Invocar el servicio para generar el token
  const token = await loginToken(credentials);

  logger.info('Autenticación exitosa (login)');
  return token;
};

/**
 * Realiza la validación del token JWT.
 * Puede venir en el body (propiedad "token") o en el header Authorization.
 *
 * @async
 * @function authValidateTokenModule
 * @param {import('express').Request} req
 * @returns {Promise<Object>} Payload decodificado del token.
 * @throws {Error} Si el token es inválido o no se provee.
 */
const authValidateTokenModule = async (req) => {
  logger.info('Inicio de validación de token');

  logger.info('Validando el esquema del cuerpo de la solicitud');
  validateBodySchema(req.body, authValidateTokenSchema, 'XXX.XXX.0001');
  logger.info('Esquema validado correctamente');

  // Token en el body
  let token = req.body.token;

  // Si no está en el body, buscar en el header 'Authorization'
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new AuthError(
      'AUTH.TOKEN.MISSING',
      'Token no provisto en body o en headers.',
      401
    );
  }

  // Invocar el servicio de validación
  const decoded = await authValidateTokenService(token);
  logger.info('Validación de token exitosa');
  return decoded;
};

/**
 * Realiza el refresco del token JWT.
 * A partir de un token válido, genera uno nuevo y lo persiste en BD.
 *
 * @async
 * @function authRefreshTokenModule
 * @param {import('express').Request} req
 * @returns {Promise<String>} El nuevo token.
 * @throws {Error}
 */
const authRefreshTokenModule = async (req) => {
  logger.info('Inicio de refresco de token');

  // El token de entrada puede venir en el body o en el header
  let token = req.body.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new AuthError(
      'AUTH.REFRESH.MISSING_TOKEN',
      'Token no provisto para refrescar.',
      401
    );
  }

  const newToken = await refreshTokenService(token);
  logger.info('Refresco de token exitoso');
  return newToken;
};

module.exports = {
  authLoginModule,
  authValidateTokenModule,
  authRefreshTokenModule,
};
