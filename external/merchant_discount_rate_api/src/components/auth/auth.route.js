// src/components/auth/auth.route.js

/**
 * Rutas relacionadas con la autenticación.
 *
 * @module authRoutes
 */

const LoggerHelper = require('../../helpers/logger.helper');
const {
    authLoginController,
    validateTokenController,
    refreshTokenController
} = require('./auth.controller');

const logger = new LoggerHelper('auth.route.js');

/**
 * Configura las rutas de autenticación en la aplicación.
 *
 * @function authRoutes
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 * @param {string} prefixApi - Prefijo para las rutas de la API.
 */
const authRoutes = (app, prefixApi) => {
    // Ruta para login de autenticación
    const loginRoute = `${prefixApi}/auth/login`;
    logger.info(`Registrando ruta: [POST] ${loginRoute}`);
    app.post(loginRoute, authLoginController);

    // Ruta para validación de token JWT
    const validateRoute = `${prefixApi}/auth/validate`;
    logger.info(`Registrando ruta: [POST] ${validateRoute}`);
    app.post(validateRoute, validateTokenController);

    // Ruta para refrescar token
    const refreshRoute = `${prefixApi}/auth/refresh`;
    logger.info(`Registrando ruta: [POST] ${refreshRoute}`);
    app.post(refreshRoute, refreshTokenController);
};

module.exports = authRoutes;
