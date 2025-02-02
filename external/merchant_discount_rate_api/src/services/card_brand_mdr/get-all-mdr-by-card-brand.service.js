// src/services/card_brand_mdr/get-all-mdr-by-card-brand.service.js

/**
 * Servicio para la obtención de tasas de descuento para comerciantes (MDR) de una marca específica.
 *
 * Este servicio obtiene la información de las tablas de MDR para una sola marca:
 * Amex, Discover, Mastercard o Visa, según el parámetro proporcionado.
 *
 * @module getAllMerchantsDiscountRateByCardBrandService
 */

const MdrAmexRepository = require('../../db/repositories/mdr_amex.repository');
const MdrDiscoverRepository = require('../../db/repositories/mdr_discover.repository');
const MdrMastercardRepository = require('../../db/repositories/mdr_mastercard.repository');
const MdrVisaRepository = require('../../db/repositories/mdr_visa.repository');

const { handleThrownError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('get-merchants-discount-rate-by-card-brand.service.js');

/**
 * Obtiene las tasas de descuento (MDR) para una marca de tarjeta específica.
 *
 * Usa un `switch` para determinar qué repositorio consultar en función de la marca.
 * Si la marca no es reconocida, se lanza un error.
 *
 * @async
 * @function getAllMerchantsDiscountRateByCardBrandService
 * @param {string} cardBrand - Marca de tarjeta: "amex", "discover", "mastercard", "visa".
 * @returns {Promise<Object>} Objeto que contiene la información de la marca solicitada.
 * @throws {Error} Error con mensaje personalizado si la marca no es soportada o si la consulta falla.
 */
const getAllMerchantsDiscountRateByCardBrandService = async (cardBrand) => {
  logger.info(`Inicio del servicio getAllMerchantsDiscountRateByCardBrandService para la marca: ${cardBrand}`);

  let mdrData;

  // Determinar el repositorio a consultar según la marca
  switch (cardBrand.toLowerCase()) {
    case 'amex': {
      const mdrAmexRepo = new MdrAmexRepository();
      try {
        mdrData = await mdrAmexRepo.scan();
      } catch (error) {
        logger.error(`Error al obtener datos de Amex: ${error.message}`, error);
        return handleThrownError(
          error,
          'MDR.GETALL.AMEX',
          'Error al obtener tasas de descuento para Amex.',
          500
        );
      }
      break;
    }
    case 'discover': {
      const mdrDiscoverRepo = new MdrDiscoverRepository();
      try {
        mdrData = await mdrDiscoverRepo.scan();
      } catch (error) {
        logger.error(`Error al obtener datos de Discover: ${error.message}`, error);
        return handleThrownError(
          error,
          'MDR.GETALL.DISCOVER',
          'Error al obtener tasas de descuento para Discover.',
          500
        );
      }
      break;
    }
    case 'mastercard': {
      const mdrMastercardRepo = new MdrMastercardRepository();
      try {
        mdrData = await mdrMastercardRepo.scan();
      } catch (error) {
        logger.error(`Error al obtener datos de Mastercard: ${error.message}`, error);
        return handleThrownError(
          error,
          'MDR.GETALL.MASTERCARD',
          'Error al obtener tasas de descuento para Mastercard.',
          500
        );
      }
      break;
    }
    case 'visa': {
      const mdrVisaRepo = new MdrVisaRepository();
      try {
        mdrData = await mdrVisaRepo.scan();
      } catch (error) {
        logger.error(`Error al obtener datos de Visa: ${error.message}`, error);
        return handleThrownError(
          error,
          'MDR.GETALL.VISA',
          'Error al obtener tasas de descuento para Visa.',
          500
        );
      }
      break;
    }
    default: {
      const err = new Error(`La marca de tarjeta '${cardBrand}' no está soportada.`);
      logger.error(err.message);
      throw err;
    }
  }

  logger.info(`Finalización exitosa del servicio getAllMerchantsDiscountRateByCardBrandService para la marca: ${cardBrand}`);
  return { discountRates: { [cardBrand.toLowerCase()]: mdrData } };
};

module.exports = {
  getAllMerchantsDiscountRateByCardBrandService,
};
