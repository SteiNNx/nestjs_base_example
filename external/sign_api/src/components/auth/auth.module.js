// src/components/auth/auth.module.js

/**
 * Módulo de autenticación.
 * Se encarga de extraer las credenciales desde la solicitud y delegar en el servicio de login.
 *
 * @module authModule
 */

const { loginToken } = require('../../services/auth-login-token.service');
const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('auth.module');

/**
 * Realiza la autenticación extrayendo las credenciales del body de la solicitud.
 *
 * @async
 * @function authModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<String>} Token JWT firmado.
 * @throws {Error} Si las credenciales son inválidas.
 */
const authModule = async (req) => {
  logger.info('[auth.module] Inicio de autenticación');
  
  // ============================================================================
  // Extraer las credenciales del cuerpo de la solicitud
  // ============================================================================
  const credentials = req.body;
  
  // ============================================================================
  // Invocar el servicio para generar el token
  // ============================================================================
  const token = await loginToken(credentials);
  
  logger.info('[auth.module] Autenticación exitosa');
  return token;
};

module.exports = { authModule };
