// src/services/auth-login-token.service.js

/**
 * @file auth-login-token.service.js
 * @description Servicio para manejar la autenticación de usuarios y generación de tokens JWT.
 */

const UsersRepository = require('../db/repositories/users.repository');
const { generateToken } = require('../helpers/jsonwebtoken.helper');
const { verifyPassword } = require('../helpers/bcrypt.helper');
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
 * @param {string} credentials.username - Nombre de usuario del cliente.
 * @param {string} credentials.password - Contraseña del cliente.
 * @returns {Promise<String>} Token JWT firmado.
 * @throws {AuthError} Si las credenciales son inválidas.
 * @throws {Error} Si ocurre un error inesperado durante el proceso de autenticación.
 *
 * @example
 * const credentials = { username: 'admin', password: 'admin123' };
 * const token = await loginToken(credentials);
 * console.log(token); // Muestra el token JWT generado
 */
const loginToken = async (credentials) => {
  try {
    logger.info('Iniciando proceso de autenticación de usuario');

    const { username, password } = credentials;
    logger.debug(`Credenciales recibidas para el usuario: ${username}`);

    if (!username || !password) {
      logger.warn('Faltan credenciales de usuario o contraseña');
      throw new AuthError('AUTH.LOGIN.MISSING_CREDENTIALS', 'Faltan credenciales de usuario o contraseña.', 400);
    }

    // Instanciar el repositorio de usuarios
    const usersRepository = new UsersRepository();

    logger.info(`Buscando usuario en la base de datos: ${username}`);
    const user = await usersRepository.getByUsername(username);

    if (!user) {
      logger.warn(`Usuario no encontrado: ${username}`);
      throw new AuthError('AUTH.LOGIN.INVALID_CREDENTIALS', 'Credenciales inválidas.', 401);
    }

    logger.info(`Usuario encontrado: ${username}. Verificando contraseña`);
    const hashedPassword = user.password.S;

    const isPasswordValid = await verifyPassword(password, hashedPassword);

    if (!isPasswordValid) {
      logger.warn(`Contraseña incorrecta para el usuario: ${username}`);
      throw new AuthError('AUTH.LOGIN.VERIFYPASSWORD', 'Credenciales inválidas.', 401);
    }

    logger.info(`Contraseña verificada correctamente para el usuario: ${username}`);

    // Construir el payload del token
    const payload = {
      username: user.username.S,
      role: user.role.S, // Asumiendo que el atributo 'role' está presente y es de tipo string
      userId: parseInt(user.userId.N, 10), // Convertir userId a número
    };

    logger.debug(`Payload para el token JWT: ${JSON.stringify(payload)}`);

    // Generar el token JWT usando el helper
    const token = generateToken(payload);
    logger.info('Token JWT generado correctamente');

    return token;
  } catch (error) {
    logger.error('Error durante el proceso de autenticación', { error: error.message, stack: error.stack });

    // Lanza el error usando handleThrownError; este método verificará si el error es conocido y
    // en caso contrario lanzará un nuevo TechnicalError con el código y mensaje por defecto.
    handleThrownError(error, 'AUTH.LOGIN.0001', 'Error generando token en el proceso de autenticación.');
  }
};

module.exports = { loginToken };
