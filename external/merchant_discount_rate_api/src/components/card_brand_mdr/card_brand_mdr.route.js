// src/components/card_brand_mdr/card_brand_mdr.route.js

/**
 * @module cardBrandMdrRoutes
 * @description Rutas para la gestión de tasas de descuento (MDR) de comerciantes.
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
 * @function cardBrandMdrRoutes
 * @description Registra las rutas relacionadas con las tasas de descuento (MDR) para comerciantes.
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
    getAllMerchantsDiscountRateController
  );

  // ==============================================
  // Ruta para obtener tasas de descuento de una marca específica.
  // Se espera que el parámetro :cardBrand sea "amex", "discover", "mastercard" o "visa".
  // ==============================================
  const routeByBrand = `${prefixApi}/card-brand-mdr/get-all-mdr-by-card-brand/:cardBrand`;
  logger.info(`Registrando ruta: [GET] ${routeByBrand}`);
  app.get(
    routeByBrand,
    validateAuthTokenMiddleware,
    getAllMerchantsDiscountRateByCardBrandController
  );

  // ==============================================
  // Ruta para actualizar campos de MDR por marca y MCC.
  // ==============================================
  const routeUpdate = `${prefixApi}/card-brand-mdr/update/:cardBrand/mcc/:mcc`;
  logger.info(`Registrando ruta: [PUT] ${routeUpdate}`);
  app.put(
    routeUpdate,
    validateAuthTokenMiddleware,
    updateMerchantsDiscountRateByCardBrandAndMccController
  );

  // ==============================================
  // Ruta para eliminar el registro (MCC) por marca.
  // ==============================================
  const routeDelete = `${prefixApi}/card-brand-mdr/delete/:cardBrand/mcc/:mcc`;
  logger.info(`Registrando ruta: [DELETE] ${routeDelete}`);
  app.delete(
    routeDelete,
    validateAuthTokenMiddleware,
    deleteMerchantsDiscountRateByCardBrandAndMccController
  );
};

module.exports = cardBrandMdrRoutes;
