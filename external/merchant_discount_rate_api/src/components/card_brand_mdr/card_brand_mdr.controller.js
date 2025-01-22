// src/components/card_brand_mdr/card_brand_mdr.controller.js

/**
 * Módulo que orquesta la obtención de tasas de descuento para comerciantes (MDR).
 * Conecta el controlador con el módulo correspondiente.
 *
 * @module cardBrandMdrController
 */

const {
  getAllMerchantsDiscountRateModule,
  getAllMerchantsDiscountRateByCardBrandModule,
} = require('./card_brand_mdr.module');
const { handleNextError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('card_brand_mdr.controller.js');

/**
 * Controlador para obtener todas las tasas de descuento (MDR) de diversas marcas de tarjetas.
 *
 * Este controlador invoca un módulo de negocio para consultar la información de Amex, Discover, Mastercard y Visa.
 * Configura cabeceras de seguridad y devuelve la información resultante en formato JSON.
 *
 * @async
 * @function getAllMerchantsDiscountRateController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con las tasas de descuento consolidadas.
 */
const getAllMerchantsDiscountRateController = async (req, res, next) => {
  logger.info('Inicio del controlador getAllMerchantsDiscountRateController');

  try {
    // =======================================================================
    // Invocar módulo de negocio para obtener las tasas MDR de todas las marcas
    // =======================================================================
    const result = await getAllMerchantsDiscountRateModule(req);

    // =======================================================================
    // Configuración de cabeceras de seguridad
    // =======================================================================
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa del controlador getAllMerchantsDiscountRateController');
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error en getAllMerchantsDiscountRateController: ${error.message}`, error);
    return handleNextError(
      error,
      next,
      'CARD_BRAND_MDR.GETALLMDR.0005',
      'Error desconocido en el controlador de tasas de descuento para comerciantes.'
    );
  }
};

/**
 * Controlador para obtener las tasas de descuento (MDR) de una sola marca de tarjeta.
 *
 * La marca se recibe en `req.params.cardBrand` y debe ser: "amex", "discover", "mastercard" o "visa".
 * Este controlador configura cabeceras de seguridad y retorna la información en formato JSON.
 *
 * @async
 * @function getAllMerchantsDiscountRateByCardBrandController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con las tasas de descuento de la marca solicitada.
 */
const getAllMerchantsDiscountRateByCardBrandController = async (req, res, next) => {
  logger.info('Inicio del controlador getAllMerchantsDiscountRateByCardBrandController');

  try {
    // Extraer el parámetro "cardBrand" desde la URL
    const { cardBrand } = req.params;

    // =======================================================================
    // Invocar módulo de negocio para la marca específica
    // =======================================================================
    const result = await getAllMerchantsDiscountRateByCardBrandModule(cardBrand);

    // =======================================================================
    // Configuración de cabeceras de seguridad
    // =======================================================================
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa del controlador getAllMerchantsDiscountRateByCardBrandController');
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error en getAllMerchantsDiscountRateByCardBrandController: ${error.message}`, error);
    return handleNextError(
      error,
      next,
      'CARD_BRAND_MDR.GETALLMDR.BY_BRAND.0005',
      'Error desconocido en el controlador de tasas de descuento para la marca de tarjeta especificada.'
    );
  }
};

module.exports = {
  getAllMerchantsDiscountRateController,
  getAllMerchantsDiscountRateByCardBrandController,
};
