// src/components/healthcheck/healthcheck.route.js

/**
 * Rutas relacionadas con el chequeo de salud del servidor.
 *
 * @module healthCheckRoutes
 */

const LoggerHelper = require('../../helpers/logger.helper');
const healthCheckController = require('./healthcheck.controller');

const logger = new LoggerHelper('healthcheck.route');

/**
 * Configura las rutas relacionadas con el chequeo de salud en la aplicación.
 *
 * @function healthCheckRoutes
 * @param {Object} app - La instancia de la aplicación Express.
 * @param {string} pathPrefixApi - El prefijo para las rutas de la API.
 */
const healthCheckRoutes = (app, pathPrefixApi) => {
  logger.info(`--------- [healthcheck.route] [healthcheckRoutes] - Registrando ruta: [POST] ${pathPrefixApi}/healthcheck ---------`);

  app.get(`${pathPrefixApi}/healthcheck`, healthCheckController);
};

module.exports = healthCheckRoutes;
