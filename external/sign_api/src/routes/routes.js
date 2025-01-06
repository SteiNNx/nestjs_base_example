const healthCheckRoutes = require('../components/healthcheck/healthcheck.route');
const signatureRoutes = require('../components/signature/signature.route');
const config = require('../config/config');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('routes');

const routes = (app) => {
    logger.info(`Iniciando configuración de [routes]`);

    const {
        prefixApi,
    } = config;

    healthCheckRoutes(app, prefixApi);
    signatureRoutes(app, prefixApi);

    logger.info(`Finalizando configuración de [routes]`);
}
module.exports = routes;