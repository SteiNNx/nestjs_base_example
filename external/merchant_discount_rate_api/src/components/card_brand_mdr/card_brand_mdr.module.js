// src/components/card_brand_mdr/card_brand_mdr.module.js

/**
 * Módulo para la orquestación de la obtención de tasas de descuento para comerciantes (MDR).
 * Conecta el controlador con el servicio que realiza la lógica de negocio.
 *
 * @module cardBrandMdrModule
 */

const { getAllMerchantsDiscountRateService } = require('../../services/get-all-merchants-discount-rate.service');
const LoggerHelper = require('../../helpers/logger.helper');

const logger = new LoggerHelper('card_brand_mdr.module.js');

/**
 * Orquesta la obtención de las tasas de descuento para comerciantes (MDR).
 *
 * Invoca el servicio que realiza el procesamiento de los datos MDR.
 *
 * @async
 * @function getAllMerchantsDiscountRateModule
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<Object>} Objeto con la información resultante del proceso.
 * @throws {Error} Lanza un error si ocurre algún problema en la capa de servicio.
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

module.exports = {
  getAllMerchantsDiscountRateModule,
};
