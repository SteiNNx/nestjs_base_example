// src/services/get-all-mdr.service.js

/**
 * Servicio para la obtención de tasas de descuento para comerciantes (MDR).
 *
 * Este servicio obtiene la información de las tablas de MDR para Amex, Discover,
 * Mastercard y Visa, y devuelve un objeto que contiene los datos consolidados.
 *
 * @module getAllMerchantsDiscountRateService
 */

const MdrAmexRepository = require('../../db/repositories/mdr_amex.repository');
const MdrDiscoverRepository = require('../../db/repositories/mdr_discover.repository');
const MdrMastercardRepository = require('../../db/repositories/mdr_mastercard.repository');
const MdrVisaRepository = require('../../db/repositories/mdr_visa.repository');

const { handleThrownError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('get-all-merchants-discount-rate.service.js');

/**
 * Obtiene las tasas de descuento de todas las marcas de tarjetas (Amex, Discover, Mastercard y Visa).
 *
 * Realiza consultas a los repositorios correspondientes y consolida los resultados en un único objeto.
 *
 * @async
 * @function getAllMerchantsDiscountRateService
 * @param {import('express').Request} req - Objeto de solicitud de Express (no se utiliza directamente, pero se mantiene para consistencia).
 * @returns {Promise<Object>} Objeto con la información de tasas de descuento agrupada por marca.
 * @throws {Error} Se lanza un error customizado si ocurre algún problema en la consulta a cada repositorio.
 */
const getAllMerchantsDiscountRateService = async (req) => {
  logger.info('Inicio del servicio getAllMerchantsDiscountRateService');

  // Instanciar repositorios para cada marca
  const mdrAmexRepo = new MdrAmexRepository();
  const mdrDiscoverRepo = new MdrDiscoverRepository();
  const mdrMastercardRepo = new MdrMastercardRepository();
  const mdrVisaRepo = new MdrVisaRepository();

  let amexData, discoverData, mastercardData, visaData;

  // Consulta a cada repositorio
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

  // Logs de los datos recuperados
  //logger.info('amex:', { amexData });
  //logger.info('discover:', { discoverData });
  //logger.info('mastercard:', { mastercardData });
  //logger.info('visa:', { visaData });

  // Consolidar la información de todas las marcas
  const data = {
    discountRates: {
      amex: amexData,
      discover: discoverData,
      mastercard: mastercardData,
      visa: visaData,
    },
  };

  logger.info('Finalización exitosa del servicio getAllMerchantsDiscountRateService');
  //logger.info('data:', { data });

  return data;
};

module.exports = {
  getAllMerchantsDiscountRateService,
};
