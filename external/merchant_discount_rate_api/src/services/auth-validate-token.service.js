// src/services/auth-validate-token.service.js

const UsersRepository = require('../db/repositories/users.repository');
const { validateToken } = require('../helpers/jsonwebtoken.helper');
const { handleThrownError } = require('../providers/error-handler.provider');

const AuthError = require('../exceptions/auth.exception');

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('auth-validate-token.service.js');

/**
 * Valida un token JWT y retorna el payload decodificado.
 * Además, verifica que el username y el token coincidan con el registrado en la BD.
 *
 * @async
 * @function authValidateTokenService
 * @param {String} token - El token JWT a validar.
 * @returns {Promise<Object>} El payload decodificado.
 * @throws {TechnicalError|AuthError} Si el token es inválido, ha expirado o no coincide con el de la BD.
 */
const authValidateTokenService = async (token) => {
  try {
    logger.info('Iniciando validación del token');

    // 1) Decodificar el token
    const decoded = validateToken(token);
    logger.info('Token decodificado correctamente');

    // 2) Verificar que el token contenga al menos un username
    const { username } = decoded;
    if (!username) {
      throw new AuthError(
        'AUTH.VALIDATE.NO_USERNAME',
        'El token no contiene un "username".',
        401
      );
    }

    // 3) Verificar en la BD que el token coincida
    const usersRepository = new UsersRepository();
    const user = await usersRepository.getByUsername(username);

    if (!user) {
      throw new AuthError(
        'AUTH.VALIDATE.USER_NOT_FOUND',
        `No se encontró usuario con username "${username}" en la BD.`,
        404
      );
    }

    if (user.token !== token) {
      throw new AuthError(
        'AUTH.VALIDATE.TOKEN_MISMATCH',
        'El token suministrado no coincide con el almacenado en la BD.',
        401
      );
    }

    // Si todo está bien, retornamos el payload decodificado
    logger.info('Token validado correctamente y coincide con BD');
    return decoded;

  } catch (error) {
    logger.error('Error al validar el token', { error: error.message });
    handleThrownError(error, 'AUTH.VALIDATE.0001', 'Error al validar el token JWT.');
  }
};

module.exports = { authValidateTokenService };
