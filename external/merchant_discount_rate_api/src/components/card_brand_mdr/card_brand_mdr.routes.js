// src/components/card_brand_mdr/card_brand_mdr.route.js
/**
 * Rutas relacionadas con la carga de archivos MDR.
 *
 * @module cardBrandMdrRoutes
 */

const LoggerHelper = require('../../helpers/logger.helper');
const { getAllMerchantsDiscountRateController } = require('./card_brand_mdr.controller');

const logger = new LoggerHelper('card_brand_mdr.route.js');

/**
 * Configura las rutas de carga de archivos MDR en la aplicación.
 *
 * @function cardBrandMdrRoutes
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 * @param {string} prefixApi - Prefijo para las rutas de la API.
 */
const cardBrandMdrRoutes = (app, prefixApi) => {
    // Definimos la ruta para la carga del archivo MDR
    const route = `${prefixApi}/card-brand-mdr/get-all-mdr`;
    logger.info(`Registrando ruta: [GET] ${route}`);

    // GET /card-brand-mdr/get-all-mdr
    app.get(route, getAllMerchantsDiscountRateController);
};

module.exports = cardBrandMdrRoutes;
