// src/components/auth/auth.module.js

/**
 * Módulo de autenticación.
 * Contiene la lógica para el login y la validación del token JWT.
 *
 * @module authModule
 */

const { loginToken } = require('../../services/auth-login-token.service');
const { authValidateTokenService } = require('../../services/auth-validate-token.service');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('auth.module');

/**
 * Realiza la autenticación extrayendo las credenciales del body de la solicitud.
 *
 * @async
 * @function authLoginModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<String>} Token JWT firmado.
 * @throws {Error} Si las credenciales son inválidas.
 */
const authLoginModule = async (req) => {
  logger.info('[auth.module] Inicio de autenticación (login)');

  // =======================================================================
  // Extraer las credenciales del cuerpo de la solicitud
  // =======================================================================
  const credentials = req.body;

  // =======================================================================
  // Invocar el servicio para generar el token
  // =======================================================================
  const token = await loginToken(credentials);

  logger.info('[auth.module] Autenticación exitosa (login)');
  return token;
};

/**
 * Realiza la validación del token JWT.
 * Se espera que el token se envíe en el body (propiedad "token") o en el header Authorization.
 *
 * @async
 * @function authValidateTokenModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<Object>} Payload decodificado del token.
 * @throws {Error} Si el token es inválido o no se provee.
 */
const authValidateTokenModule = async (req) => {
  logger.info('[auth.module] Inicio de validación de token');

  // =======================================================================
  // Se asume que el token se recibe en req.body.token o en req.headers.authorization
  // =======================================================================
  const token = req.body.token || req.headers.authorization;
  if (!token) {
    throw new Error('Token no provisto');
  }

  const decoded = await authValidateTokenService(token);
  logger.info('[auth.module] Validación de token exitosa');
  return decoded;
};

module.exports = {
  authLoginModule,
  authValidateTokenModule,
};
