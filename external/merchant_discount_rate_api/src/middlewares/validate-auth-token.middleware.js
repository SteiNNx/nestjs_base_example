// src/middlewares/validate-auth-token-middleware.js

/**
 * @file validate-auth-token.middleware.js
 * @description Middleware para validar un token JWT y comprobar que coincida con el token almacenado en la BD.
 */

const { authValidateTokenService } = require('../services/auth-validate-token.service');
const AuthError = require('../exceptions/auth.exception');
const UsersRepository = require('../db/repositories/users.repository');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('validate-auth-token.middleware.js');

/**
 * Middleware para validar un token JWT.
 *
 * 1) Extrae el token del header "Authorization".
 * 2) Valida el token con `authValidateTokenService`.
 * 3) Busca al usuario en BD y compara el token actual con el token guardado.
 * 4) Agrega el payload decodificado a req.user.
 * 5) En caso de error, lanza un AuthError y lo pasa al siguiente middleware.
 *
 * @async
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 */
const validateAuthTokenMiddleware = async (req, res, next) => {
    try {
        // (1) Extraer el token de la cabecera "Authorization"
        logger.info('1) Extrayendo el token de la cabecera "Authorization"');
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            // Lanzar error de autenticación si el header no existe
            throw new AuthError(
                'AUTH.HEADER.MISSING',
                'Header Authorization no provisto.',
                401
            );
        }

        // Se asume que el header viene en el formato "Bearer <token>"
        logger.info('   - Se asume formato "Bearer <token>" para extraer el token');
        const token = authHeader.split(' ')[1];
        if (!token) {
            // Lanzar error si no se encuentra el token en el header
            throw new AuthError(
                'AUTH.TOKEN.MISSING',
                'Token no encontrado en el header Authorization.',
                401
            );
        }

        // (2) Validar el token utilizando el servicio
        logger.info('2) Validando token JWT con el servicio authValidateTokenService');
        const decoded = await authValidateTokenService(token);

        // (3) Verificar que el token coincida con el almacenado en BD
        logger.info('3) Verificando que el token coincida con el almacenado en BD');
        const usersRepository = new UsersRepository();
        const user = await usersRepository.getByUsername(decoded.username);

        if (!user) {
            throw new AuthError(
                'AUTH.USER.NOT_FOUND',
                'No se encontró el usuario relacionado al token.',
                404
            );
        }

        // Ajusta la propiedad "user.token" si tu objeto devuelto por DynamoDB difiere
        if (user.token !== token) {
            throw new AuthError(
                'AUTH.TOKEN.MISMATCH',
                'El token no coincide con el almacenado en la BD.',
                401
            );
        }

        // (4) Agregar la información decodificada a req.user
        req.user = decoded;
        logger.info('   - Token validado y coincidente. Se asigna req.user');

        // Pasar al siguiente middleware
        next();
    } catch (error) {
        logger.error(`Error al validar token: ${error.message}`);
        next(error);
    }
};

module.exports = validateAuthTokenMiddleware;
