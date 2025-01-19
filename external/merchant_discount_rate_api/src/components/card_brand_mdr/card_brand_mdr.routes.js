// src/components/card_brand_mdr/card_brand_mdr.route.js

/**
 * Rutas relacionadas con la obtención de tasas de descuento para comerciantes (MDR).
 *
 * @module cardBrandMdrRoutes
 */

const LoggerHelper = require('../../helpers/logger.helper');
const { getAllMerchantsDiscountRateController } = require('./card_brand_mdr.controller');

const logger = new LoggerHelper('card_brand_mdr.route.js');

/**
 * Configura las rutas de obtención de tasas de descuento para comerciantes en la aplicación.
 *
 * @function cardBrandMdrRoutes
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 * @param {string} prefixApi - Prefijo para las rutas de la API.
 */
const cardBrandMdrRoutes = (app, prefixApi) => {
  const route = `${prefixApi}/card-brand-mdr/get-all-mdr`;
  logger.info(`Registrando ruta: [GET] ${route}`);

  // GET /card-brand-mdr/get-all-mdr
  app.get(route, getAllMerchantsDiscountRateController);
};

module.exports = cardBrandMdrRoutes;
