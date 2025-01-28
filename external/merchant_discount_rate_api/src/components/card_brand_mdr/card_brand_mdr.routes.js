// src/components/card_brand_mdr/card_brand_mdr.route.js

/**
 * Rutas relacionadas con la obtención de tasas de descuento para comerciantes (MDR).
 *
 * @module cardBrandMdrRoutes
 */

const validateAuthTokenMiddleware = require('../../middlewares/validate-auth-token.middleware');
const {
  getAllMerchantsDiscountRateController,
  getAllMerchantsDiscountRateByCardBrandController,
  updateMerchantsDiscountRateByCardBrandAndMccController,
  deleteMerchantsDiscountRateByCardBrandAndMccController,
} = require('./card_brand_mdr.controller');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('card_brand_mdr.route.js');

/**
 * Registra las rutas en la aplicación para obtener las tasas de descuento (MDR),
 * actualizar y eliminar registros.
 *
 * - GET /card-brand-mdr/get-all-mdr
 *   Devuelve la información consolidada de todas las marcas.
 * - GET /card-brand-mdr/get-all-mdr-by-card-brand/:cardBrand
 *   Devuelve la información de la marca específica.
 * - PUT /card-brand-mdr/update/:cardBrand/mcc/:mcc
 *   Actualiza uno o varios campos de un MCC en la marca específica.
 * - DELETE /card-brand-mdr/delete/:cardBrand/mcc/:mcc
 *   Elimina el registro (MCC) en la marca específica.
 *
 * @function cardBrandMdrRoutes
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 * @param {string} prefixApi - Prefijo para las rutas de la API.
 */
const cardBrandMdrRoutes = (app, prefixApi) => {
  // ==============================================
  // Ruta para obtener las tasas de descuento de todas las marcas
  // ==============================================
  const routeAll = `${prefixApi}/card-brand-mdr/get-all-mdr`;
  logger.info(`Registrando ruta: [GET] ${routeAll}`);
  app.get(
    routeAll,
    validateAuthTokenMiddleware,
    getAllMerchantsDiscountRateController,
  );

  // ==============================================
  // Ruta para obtener tasas de descuento de una marca específica
  // Param :cardBrand = "amex", "discover", "mastercard" o "visa"
  // ==============================================
  const routeByBrand = `${prefixApi}/card-brand-mdr/get-all-mdr-by-card-brand/:cardBrand`;
  logger.info(`Registrando ruta: [GET] ${routeByBrand}`);
  app.get(
    routeByBrand,
    validateAuthTokenMiddleware,
    getAllMerchantsDiscountRateByCardBrandController,
  );

  // ==============================================
  // NUEVA RUTA: Actualizar campos de MDR por marca y MCC
  // ==============================================
  const routeUpdate = `${prefixApi}/card-brand-mdr/update/:cardBrand/mcc/:mcc`;
  logger.info(`Registrando ruta: [PUT] ${routeUpdate}`);
  app.put(
    routeUpdate,
    validateAuthTokenMiddleware,
    updateMerchantsDiscountRateByCardBrandAndMccController,
  );

  // ==============================================
  // NUEVA RUTA: Eliminar registro (MCC) por marca
  // ==============================================
  const routeDelete = `${prefixApi}/card-brand-mdr/delete/:cardBrand/mcc/:mcc`;
  logger.info(`Registrando ruta: [DELETE] ${routeDelete}`);
  app.delete(
    routeDelete,
    validateAuthTokenMiddleware,
    deleteMerchantsDiscountRateByCardBrandAndMccController,
  );
};

module.exports = cardBrandMdrRoutes;
