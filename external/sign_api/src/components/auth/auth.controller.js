// src/components/auth/auth.controller.js

/**
 * Controlador para la autenticación.
 * Se encarga de recibir la solicitud, invocar el módulo de autenticación y retornar el token JWT.
 *
 * @module authController
 */

const { authModule } = require('./auth.module');
const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('auth.controller');

/**
 * Realiza la autenticación del usuario y retorna el token JWT.
 *
 * @async
 * @function authController
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @param {import('express').Response} res - Objeto de respuesta HTTP de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con el token JWT en formato JSON.
 */
const authController = async (req, res, next) => {
    logger.info('[auth.controller] Inicio de autenticación');

    try {
        // ============================================================================
        // Invocar el módulo de autenticación para obtener el token
        // ============================================================================
        const token = await authModule(req);

        // ============================================================================
        // Configuración de cabeceras de seguridad
        // ============================================================================
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "script-src 'self'");

        logger.info('[auth.controller] Autenticación exitosa, retornando token');
        return res.status(200).json({ token });
    } catch (error) {
        logger.error('[auth.controller] Error en autenticación', { error: error.message });
        return next(error);
    }
};

module.exports = authController;
