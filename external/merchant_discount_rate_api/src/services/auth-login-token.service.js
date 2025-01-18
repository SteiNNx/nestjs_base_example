// src/services/auth-login-token.service.js

const { generateToken } = require('../helpers/jsonwebtoken.helper');
const { handleThrownError } = require('../providers/error-handler.provider');
const AuthError = require('../exceptions/auth.exception');

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('auth-login-token.service.js');

/**
 * Valida las credenciales y retorna un token JWT si son correctas.
 *
 * @async
 * @function loginToken
 * @param {Object} credentials - Objeto con las propiedades "username" y "password".
 * @returns {Promise<String>} Token JWT firmado.
 * @throws {Error} Si las credenciales son inválidas o ocurre un error inesperado.
 */
const loginToken = async (credentials) => {
  try {
    logger.info('Iniciando validación de credenciales');
    const { username, password } = credentials;

    // Validación de credenciales: se acepta solo el usuario y password "test"
    if (username === 'test' && password === 'test') {
      logger.info('Credenciales válidas');

      // Construir el payload del token
      const payload = { username: 'test', role: 'user' };

      // Generar el token JWT usando el helper
      const token = generateToken(payload);
      logger.info('Token generado correctamente');
      return token;
    } else {
      logger.error('Credenciales inválidas');
      throw new AuthError('AUTH.LOGIN.INVALID_CREDENTIALS', 'Credenciales inválidas.', 401);
    }
  } catch (error) {
    logger.error('Error al generar token', { error: error.message });
    // Lanza el error usando handleThrownError; este método verificará si el error es conocido y
    // en caso contrario lanzará un nuevo TechnicalError con el código y mensaje por defecto.
    handleThrownError(error, 'AUTH.LOGIN.0001', 'Error generando token en el proceso de autenticación.');
  }
};

module.exports = { loginToken };
