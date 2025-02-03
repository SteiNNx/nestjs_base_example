// src/components/card_brand_mdr/card_brand_mdr.controller.js

/**
 * @module cardBrandMdrController
 * @description Controladores para la gestión de las tasas de descuento (MDR) de diversas marcas de tarjetas.
 */

const {
  getAllMerchantsDiscountRateModule,
  getAllMerchantsDiscountRateByCardBrandModule,
  updateMerchantsDiscountRateByCardBrandAndMccModule,
  deleteMerchantsDiscountRateByCardBrandAndMccModule,
} = require('./card_brand_mdr.module');

const { handleNextError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('card_brand_mdr.controller.js');

/**
 * @async
 * @function getAllMerchantsDiscountRateController
 * @description Controlador para obtener todas las tasas de descuento (MDR) de todas las marcas.
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con la lista de tasas de descuento.
 */
const getAllMerchantsDiscountRateController = async (req, res, next) => {
  logger.info('Inicio del controlador getAllMerchantsDiscountRateController');
  try {
    const result = await getAllMerchantsDiscountRateModule(req);

    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa de getAllMerchantsDiscountRateController');
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
 * @async
 * @function getAllMerchantsDiscountRateByCardBrandController
 * @description Controlador para obtener las tasas de descuento (MDR) de una marca de tarjeta específica.
 * @param {import('express').Request} req - Objeto de solicitud HTTP; se espera que req.params.cardBrand esté definido.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con la tasa de descuento de la marca especificada.
 */
const getAllMerchantsDiscountRateByCardBrandController = async (req, res, next) => {
  logger.info('Inicio del controlador getAllMerchantsDiscountRateByCardBrandController');
  try {
    const result = await getAllMerchantsDiscountRateByCardBrandModule(req);

    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa de getAllMerchantsDiscountRateByCardBrandController');
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

/**
 * @async
 * @function updateMerchantsDiscountRateByCardBrandAndMccController
 * @description Controlador para actualizar uno o varios campos de la tasa de descuento (MDR) de una marca específica, identificada por su MCC.
 * @param {import('express').Request} req - Objeto de solicitud HTTP; se espera que req.params.cardBrand y req.params.mcc estén definidos.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con el mensaje de actualización y los datos actualizados.
 */
const updateMerchantsDiscountRateByCardBrandAndMccController = async (req, res, next) => {
  logger.info('Inicio del controlador updateMerchantsDiscountRateByCardBrandAndMccController');
  try {
    const result = await updateMerchantsDiscountRateByCardBrandAndMccModule(req);

    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa de updateMerchantsDiscountRateByCardBrandAndMccController');
    return res.status(200).json({
      message: 'Registro actualizado correctamente.',
      updatedData: result,
    });
  } catch (error) {
    logger.error(`Error en updateMerchantsDiscountRateByCardBrandAndMccController: ${error.message}`, error);
    return handleNextError(
      error,
      next,
      'CARD_BRAND_MDR.UPDATE_BY_BRAND.0005',
      'Error desconocido al actualizar la tasa de descuento para la marca de tarjeta especificada.'
    );
  }
};

/**
 * @async
 * @function deleteMerchantsDiscountRateByCardBrandAndMccController
 * @description Controlador para eliminar un registro (identificado por el MCC) de la tasa de descuento para una marca específica.
 * @param {import('express').Request} req - Objeto de solicitud HTTP; se espera que req.params.cardBrand y req.params.mcc estén definidos.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con el mensaje de eliminación exitosa.
 */
const deleteMerchantsDiscountRateByCardBrandAndMccController = async (req, res, next) => {
  logger.info('Inicio del controlador deleteMerchantsDiscountRateByCardBrandAndMccController');
  try {
    // Se asume que el módulo de eliminación maneja internamente la extracción de cardBrand y mcc.
    await deleteMerchantsDiscountRateByCardBrandAndMccModule(req);

    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa de deleteMerchantsDiscountRateByCardBrandAndMccController');
    // NOTA: Las variables mcc y cardBrand deben definirse o extraerse de req.params si se quiere mostrarlas en el mensaje.
    const { cardBrand, mcc } = req.params;
    return res.status(200).json({
      message: `Registro MCC=${mcc} de la marca '${cardBrand}' eliminado correctamente.`,
    });
  } catch (error) {
    logger.error(`Error en deleteMerchantsDiscountRateByCardBrandAndMccController: ${error.message}`, error);
    return handleNextError(
      error,
      next,
      'CARD_BRAND_MDR.DELETE_BY_BRAND.0005',
      'Error desconocido al eliminar la tasa de descuento para la marca de tarjeta especificada.'
    );
  }
};

module.exports = {
  getAllMerchantsDiscountRateController,
  getAllMerchantsDiscountRateByCardBrandController,
  updateMerchantsDiscountRateByCardBrandAndMccController,
  deleteMerchantsDiscountRateByCardBrandAndMccController,
};
