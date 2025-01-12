// src/components/auth/auth.route.js

/**
 * Rutas relacionadas con la autenticación.
 *
 * @module authRoutes
 */

const LoggerHelper = require('../../helpers/logger.helper');
const authController = require('./auth.controller');

const logger = new LoggerHelper('auth.route');

/**
 * Configura la ruta de autenticación en la aplicación.
 *
 * @function authRoutes
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 * @param {string} prefixApi - Prefijo para las rutas de la API.
 */
const authRoutes = (app, prefixApi) => {
    const route = `${prefixApi}/auth`;
    logger.info(`[auth.route] Registrando ruta: [POST] ${route}`);
    app.post(route, authController);
};

module.exports = authRoutes;
