// src/middlewares/validate-auth-token-middleware.js

const { authValidateTokenService } = require('../services/auth-validate-token.service');
const AuthError = require('../exceptions/auth.exception'); // Se usan errores de autenticación

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('validate-auth-token.middleware.js');

/**
 * Middleware para validar un token JWT.
 * - Extrae el token del header "Authorization".
 * - Utiliza el servicio authValidateTokenService para validar el token.
 * - Si es válido, agrega el payload decodificado a req.user.
 * - En caso de error, lanza un AuthError y lo pasa al siguiente middleware.
 *
 * @async
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 */
const validateAuthTokenMiddleware = async (req, res, next) => {
    try {
        // Extraer el token de la cabecera "Authorization"
        logger.info('Extrayendo el token de la cabecera "Authorization"');
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            // Lanzar error de autenticación si el header no existe
            throw new AuthError('AUTH.HEADER.MISSING', 'Header Authorization no provisto.', 401);
        }

        // Se asume que el header viene en el formato "Bearer <token>"
        logger.info('Se asume que el header viene en el formato "Bearer <token>" y se extrae "authHeader.split" ');
        const token = authHeader.split(' ')[1];
        if (!token) {
            // Lanzar error si no se encuentra el token en el header
            throw new AuthError('AUTH.TOKEN.MISSING', 'Token no encontrado en el header Authorization.', 401);
        }

        logger.info('Validando token JWT');

        // Validar el token utilizando el servicio
        const decoded = await authValidateTokenService(token);

        // Agregar la información decodificada a req (por ejemplo, req.user)
        req.user = decoded;
        logger.info('Token validado correctamente');

        next();
    } catch (error) {
        logger.error(`Error al validar token: ${error.message}`);
        next(error);
    }
};

module.exports = validateAuthTokenMiddleware;
