// src/components/card_brand_mdr/card_brand_mdr.module.js

/**
 * Módulo para la orquestación de la obtención de tasas de descuento para comerciantes (MDR).
 * Conecta el controlador con el servicio que realiza la lógica de negocio.
 *
 * @module cardBrandMdrModule
 */

const { getAllMerchantsDiscountRateService } = require('../../services/get-all-mdr.service');
const { getAllMerchantsDiscountRateByCardBrandService } = require('../../services/get-all-mdr-by-card-brand.service');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('card_brand_mdr.module.js');

/**
 * Orquesta la obtención de las tasas de descuento para comerciantes (MDR) en todas las marcas.
 *
 * Llama a la capa de servicios para consolidar la información de las diferentes marcas.
 *
 * @async
 * @function getAllMerchantsDiscountRateModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<Object>} Objeto con todas las tasas de descuento consolidadas.
 * @throws {Error} Se relanza el error si ocurre algún problema en la capa de servicio.
 */
const getAllMerchantsDiscountRateModule = async (req) => {
  logger.info('Inicio del módulo getAllMerchantsDiscountRateModule');

  try {
    const result = await getAllMerchantsDiscountRateService(req);
    logger.info('Finalización exitosa del módulo getAllMerchantsDiscountRateModule');
    return result;
  } catch (error) {
    logger.error(`Error en getAllMerchantsDiscountRateModule: ${error.message}`, error);
    throw error;
  }
};

/**
 * Orquesta la obtención de las tasas de descuento (MDR) para una marca de tarjeta específica.
 *
 * Llama a la capa de servicios para consultar únicamente la marca solicitada.
 *
 * @async
 * @function getAllMerchantsDiscountRateByCardBrandModule
 * @param {string} cardBrand - Nombre de la marca de tarjeta ("amex", "discover", "mastercard", "visa").
 * @returns {Promise<Object>} Objeto con las tasas de descuento para la marca solicitada.
 * @throws {Error} Se relanza el error si ocurre algún problema en la capa de servicio.
 */
const getAllMerchantsDiscountRateByCardBrandModule = async (cardBrand) => {
  logger.info(`Inicio del módulo getAllMerchantsDiscountRateByCardBrandModule para ${cardBrand}`);

  try {
    const result = await getAllMerchantsDiscountRateByCardBrandService(cardBrand);
    logger.info(`Finalización exitosa del módulo getAllMerchantsDiscountRateByCardBrandModule para ${cardBrand}`);
    return result;
  } catch (error) {
    logger.error(`Error en getAllMerchantsDiscountRateByCardBrandModule: ${error.message}`, error);
    throw error;
  }
};

module.exports = {
  getAllMerchantsDiscountRateModule,
  getAllMerchantsDiscountRateByCardBrandModule,
};
