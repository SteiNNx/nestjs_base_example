// src/services/get-all-merchants-discount-rate.service.js

/**
 * Servicio para la obtención de tasas de descuento para comerciantes (MDR).
 *
 * @module getAllMerchantsDiscountRateService
 */

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('get-all-merchants-discount-rate.service.js');

/**
 * Obtiene las tasas de descuento para comerciantes (MDR).
 *
 * Este servicio debería invocar la capa de negocio o el repositorio
 * encargado de obtener los datos reales desde la fuente correspondiente.
 *
 * @async
 * @function getAllMerchantsDiscountRateService
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<Object>} Objeto con la información resultante del proceso.
 * @throws {Error} Lanza un error si ocurre algún problema durante el proceso.
 */
const getAllMerchantsDiscountRateService = async (req) => {
  logger.info('Inicio del servicio getAllMerchantsDiscountRateService');

  try {
    // Ejemplo: Se simula la obtención de datos MDR.
    // Aquí se debería colocar la lógica de negocio real o la llamada a un repositorio.
    const data = {
      discountRates: [
        /* Ejemplo: { merchant: 'Merchant1', rate: 2.5 }, ... */
      ]
    };

    logger.info('Finalización exitosa del servicio getAllMerchantsDiscountRateService');
    return data;
  } catch (error) {
    logger.error(`Error en getAllMerchantsDiscountRateService: ${error.message}`, error);
    throw error;
  }
};

module.exports = {
  getAllMerchantsDiscountRateService,
};
