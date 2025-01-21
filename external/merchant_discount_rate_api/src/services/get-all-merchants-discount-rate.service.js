// src/services/get-all-merchants-discount-rate.service.js

/**
 * Servicio para la obtención de tasas de descuento para comerciantes (MDR).
 *
 * Este servicio obtiene la información de las tablas de MDR para Amex, Discover,
 * Mastercard y Visa, y devuelve un objeto que contiene los datos consolidados.
 *
 * @module getAllMerchantsDiscountRateService
 */

const MdrAmexRepository = require('../db/repositories/mdr_amex.repository');
const MdrDiscoverRepository = require('../db/repositories/mdr_discover.repository');
const MdrMastercardRepository = require('../db/repositories/mdr_mastercard.repository');
const MdrVisaRepository = require('../db/repositories/mdr_visa.repository');

const { handleThrownError } = require('../providers/error-handler.provider');

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('get-all-merchants-discount-rate.service.js');

/**
 * Obtiene las tasas de descuento para comerciantes (MDR) de todas las marcas.
 *
 * Este servicio invoca la capa de repositorios para obtener los registros de las tablas
 * correspondientes a Amex, Discover, Mastercard y Visa, y consolida la información en un único objeto.
 *
 * @async
 * @function getAllMerchantsDiscountRateService
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<Object>} Objeto con la información consolidada de las tasas de descuento.
 * @throws {Error} Lanza un error customizado si ocurre algún problema durante el proceso.
 *
 * @example
 * const result = await getAllMerchantsDiscountRateService(req);
 * console.log(result);
 * // {
 * //   discountRates: {
 * //     amex: [ ... ],
 * //     discover: [ ... ],
 * //     mastercard: [ ... ],
 * //     visa: [ ... ]
 * //   }
 * // }
 */
const getAllMerchantsDiscountRateService = async (req) => {
  logger.info('Inicio del servicio getAllMerchantsDiscountRateService');

  // Instanciamos los repositorios para cada marca
  const mdrAmexRepo = new MdrAmexRepository();
  const mdrDiscoverRepo = new MdrDiscoverRepository();
  const mdrMastercardRepo = new MdrMastercardRepository();
  const mdrVisaRepo = new MdrVisaRepository();

  let amexData, discoverData, mastercardData, visaData;

  // Invocación para Amex
  try {
    amexData = await mdrAmexRepo.scan();
  } catch (error) {
    logger.error(`Error al obtener datos de Amex: ${error.message}`, error);
    return handleThrownError(
      error,
      'MDR.GETALL.AMEX',
      'Error al obtener tasas de descuento para Amex.',
      500
    );
  }

  // Invocación para Discover
  try {
    discoverData = await mdrDiscoverRepo.scan();
  } catch (error) {
    logger.error(`Error al obtener datos de Discover: ${error.message}`, error);
    return handleThrownError(
      error,
      'MDR.GETALL.DISCOVER',
      'Error al obtener tasas de descuento para Discover.',
      500
    );
  }

  // Invocación para Mastercard
  try {
    mastercardData = await mdrMastercardRepo.scan();
  } catch (error) {
    logger.error(`Error al obtener datos de Mastercard: ${error.message}`, error);
    return handleThrownError(
      error,
      'MDR.GETALL.MASTERCARD',
      'Error al obtener tasas de descuento para Mastercard.',
      500
    );
  }

  // Invocación para Visa
  try {
    visaData = await mdrVisaRepo.scan();
  } catch (error) {
    logger.error(`Error al obtener datos de Visa: ${error.message}`, error);
    return handleThrownError(
      error,
      'MDR.GETALL.VISA',
      'Error al obtener tasas de descuento para Visa.',
      500
    );
  }

  logger.info('amex: ', { amexData: amexData });
  logger.info('discover: ', { discoverData: discoverData });
  logger.info('mastercard: ', { mastercardData: mastercardData });
  logger.info('visa: ', { visaData: visaData });

  // Consolida la información obtenida de los repositorios
  const data = {
    discountRates: {
      amex: amexData,
      discover: discoverData,
      mastercard: mastercardData,
      visa: visaData,
    },
  };

  logger.info('Finalización exitosa del servicio getAllMerchantsDiscountRateService');
  logger.info('data: ', { data: data });

  return data;
};

module.exports = {
  getAllMerchantsDiscountRateService,
};
