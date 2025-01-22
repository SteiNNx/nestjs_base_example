// src/components/card_brand_mdr/card_brand_mdr.route.js

/**
 * Rutas relacionadas con la obtención de tasas de descuento para comerciantes (MDR).
 *
 * @module cardBrandMdrRoutes
 */

const {
  getAllMerchantsDiscountRateController,
  getAllMerchantsDiscountRateByCardBrandController
} = require('./card_brand_mdr.controller');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('card_brand_mdr.route.js');

/**
 * Registra las rutas en la aplicación para obtener las tasas de descuento (MDR).
 *
 * - GET /card-brand-mdr/get-all-mdr
 *   Devuelve la información consolidada de todas las marcas.
 * - GET /card-brand-mdr/get-all-mdr-by-card-brand/:cardBrand
 *   Devuelve la información de la marca específica.
 *
 * @function cardBrandMdrRoutes
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 * @param {string} prefixApi - Prefijo para las rutas de la API.
 */
const cardBrandMdrRoutes = (app, prefixApi) => {
  // Ruta para obtener las tasas de descuento de todas las marcas
  const routeAll = `${prefixApi}/card-brand-mdr/get-all-mdr`;
  logger.info(`Registrando ruta: [GET] ${routeAll}`);
  app.get(routeAll, getAllMerchantsDiscountRateController);

  // Ruta para obtener las tasas de descuento de una marca específica
  // Param :cardBrand debe ser "amex", "discover", "mastercard" o "visa"
  const routeByBrand = `${prefixApi}/card-brand-mdr/get-all-mdr-by-card-brand/:cardBrand`;
  logger.info(`Registrando ruta: [GET] ${routeByBrand}`);
  app.get(routeByBrand, getAllMerchantsDiscountRateByCardBrandController);
};

module.exports = cardBrandMdrRoutes;
