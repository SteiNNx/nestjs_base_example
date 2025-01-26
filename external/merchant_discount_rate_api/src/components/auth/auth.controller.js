// src/components/auth/auth.controller.js

/**
 * Controlador para la autenticación.
 * Métodos:
 * - authLoginController: para la generación del token (login).
 * - validateTokenController: para la validación del token.
 * - refreshTokenController: para la generación de un nuevo token (refresh).
 *
 * @module authController
 */

const {
    authLoginModule,
    authValidateTokenModule,
    authRefreshTokenModule
} = require('./auth.module');

const { handleNextError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('auth.controller.js');

/**
 * Controlador para el login de autenticación.
 * Recibe las credenciales, invoca el módulo de login y retorna un token JWT.
 *
 * @async
 * @function authLoginController
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con el token JWT.
 */
const authLoginController = async (req, res, next) => {
    logger.info('Inicio de autenticación (login)');

    try {
        // Invocar el módulo de autenticación para obtener el token
        const token = await authLoginModule(req);

        // Configuración de cabeceras de seguridad
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "script-src 'self'");

        logger.info('Autenticación exitosa, retornando token');
        return res.status(200).json({ token });
    } catch (error) {
        logger.error('Error en autenticación (login)', { error: error.message });

        return handleNextError(
            error,
            next,
            'AUTH.LOGIN.0005',
            'Error desconocido en login.'
        );
    }
};

/**
 * Controlador para la validación del token JWT.
 * Puede recibir el token en el body ("token") o en el header Authorization.
 *
 * @async
 * @function validateTokenController
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con el payload decodificado.
 */
const validateTokenController = async (req, res, next) => {
    logger.info('Inicio de validación de token');

    try {
        // Invocar el módulo de validación de token
        const decoded = await authValidateTokenModule(req);

        // Configuración de cabeceras de seguridad
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "script-src 'self'");

        logger.info('Validación de token exitosa, retornando payload');
        return res.status(200).json({ payload: decoded });
    } catch (error) {
        logger.error('Error en validación de token', { error: error.message });

        return handleNextError(
            error,
            next,
            'AUTH.VALIDATE.0005',
            'Error desconocido en validación de token.'
        );
    }
};

/**
 * Controlador para refrescar el token JWT.
 * Recibe un token actual y devuelve uno nuevo (opcionalmente con un nuevo tiempo de vigencia).
 *
 * @async
 * @function refreshTokenController
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<import('express').Response>}
 */
const refreshTokenController = async (req, res, next) => {
    logger.info('Inicio de refresco de token');

    try {
        // Invocar el módulo de refresco de token
        const newToken = await authRefreshTokenModule(req);

        // Configuración de cabeceras de seguridad
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "script-src 'self'");

        logger.info('Refresco de token exitoso, retornando nuevo token');
        return res.status(200).json({ token: newToken });
    } catch (error) {
        logger.error('Error en refresco de token', { error: error.message });

        return handleNextError(
            error,
            next,
            'AUTH.REFRESH.0005',
            'Error desconocido al refrescar el token.'
        );
    }
};

module.exports = {
    authLoginController,
    validateTokenController,
    refreshTokenController,
};
