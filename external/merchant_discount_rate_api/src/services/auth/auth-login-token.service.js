// src/services/auth/auth-login-token.service.js

/**
 * @file auth-login-token.service.js
 * @description Servicio para manejar la autenticación de usuarios y generación de tokens JWT.
 */

const UsersRepository = require('../../db/repositories/users.repository');
const { generateToken } = require('../../helpers/jsonwebtoken.helper');
const { verifyPassword } = require('../../helpers/bcrypt.helper');
const { handleThrownError } = require('../../providers/error-handler.provider');

const AuthError = require('../../exceptions/auth.exception');
const LoggerHelper = require('../../helpers/logger.helper');

/**
 *  Servicio de generación de token (login).
 *  1) Verifica credenciales.
 *  2) Genera un token JWT.
 *  3) Almacena el token en la base de datos para ese usuario.
 * 
 * @module loginToken
 */
const logger = new LoggerHelper('auth-login-token.service.js');

/**
 * Valida las credenciales y retorna un token JWT si son correctas.
 * Además, persiste el token en la BD para el usuario.
 *
 * @async
 * @function loginToken
 * @param {Object} credentials - Objeto con las propiedades "username" y "password".
 * @param {string} credentials.username - Nombre de usuario.
 * @param {string} credentials.password - Contraseña del usuario.
 * @returns {Promise<String>} Token JWT firmado.
 * @throws {AuthError} Si las credenciales son inválidas.
 * @throws {Error} Si ocurre un error inesperado durante el proceso de autenticación.
 */
const loginToken = async (credentials) => {
  try {
    logger.info('1) Iniciando proceso de autenticación de usuario');

    const { username, password } = credentials;

    // (1) Instanciar el repositorio y buscar el usuario
    const usersRepository = new UsersRepository();
    logger.info(`   - Buscando usuario en la base de datos: ${username}`);
    const user = await usersRepository.getByUsername(username);

    if (!user) {
      logger.info(`   - Usuario no encontrado: ${username}`);
      throw new AuthError(
        'AUTH.LOGIN.INVALID_CREDENTIALS',
        'Credenciales inválidas.',
        401
      );
    }

    logger.info(`   - Usuario encontrado: ${username}. Verificando contraseña`);
    const hashedPassword = user.password; // Ajustar si tu objeto user está en formato DynamoDB

    // (2) Verificar la contraseña
    const isPasswordValid = await verifyPassword(password, hashedPassword);
    if (!isPasswordValid) {
      logger.info(`   - Contraseña incorrecta para el usuario: ${username}`);
      throw new AuthError(
        'AUTH.LOGIN.VERIFYPASSWORD',
        'Credenciales inválidas.',
        401
      );
    }

    logger.info(`   - Contraseña verificada correctamente para el usuario: ${username}`);

    // (3) Construir el payload y generar token
    const payload = {
      username: user.username,
      role: user.role || 'user',
      userId: parseInt(user.userId || 0, 10),
    };
    logger.info(`   - Payload para el token JWT: ${JSON.stringify(payload)}`);

    const token = generateToken(payload, username);
    logger.info('   - Token JWT generado correctamente');

    // (4) Guardar el token en la BD usando el método "update" genérico
    logger.info('2) Guardando el token en la BD');
    await usersRepository.update(username, 'token', token);
    logger.info('   - Token guardado en la BD correctamente');

    // (5) Retornar token
    return token;
  } catch (error) {
    logger.error('Error durante el proceso de autenticación', {
      error: error.message,
      stack: error.stack,
    });

    handleThrownError(
      error,
      'AUTH.LOGIN.0001',
      'Error generando token en el proceso de autenticación.'
    );
  }
};

module.exports = { loginToken };
