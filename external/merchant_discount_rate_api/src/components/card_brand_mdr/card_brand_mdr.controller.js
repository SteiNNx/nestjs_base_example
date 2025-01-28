// src/components/card_brand_mdr/card_brand_mdr.controller.js

/**
 * Módulo que orquesta la obtención y modificación de tasas de descuento (MDR).
 * Conecta el controlador con el módulo correspondiente.
 *
 * @module cardBrandMdrController
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
 * Controlador para obtener todas las tasas de descuento (MDR) de diversas marcas de tarjetas.
 */
const getAllMerchantsDiscountRateController = async (req, res, next) => {
  logger.info('Inicio del controlador getAllMerchantsDiscountRateController');
  try {
    const result = await getAllMerchantsDiscountRateModule(req);

    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa de getAllMerchantsDiscountRateController');
    return res
      .status(200)
      .json(result);
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
 */
const getAllMerchantsDiscountRateByCardBrandController = async (req, res, next) => {
  logger.info('Inicio del controlador getAllMerchantsDiscountRateByCardBrandController');
  try {
    const { cardBrand } = req.params;

    const result = await getAllMerchantsDiscountRateByCardBrandModule(cardBrand);

    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa de getAllMerchantsDiscountRateByCardBrandController');
    return res
      .status(200)
      .json(result);
  } catch (error) {
    logger.error(
      `Error en getAllMerchantsDiscountRateByCardBrandController: ${error.message}`,
      error
    );
    return handleNextError(
      error,
      next,
      'CARD_BRAND_MDR.GETALLMDR.BY_BRAND.0005',
      'Error desconocido en el controlador de tasas de descuento para la marca de tarjeta especificada.'
    );
  }
};

/**
 * NUEVO Controlador para actualizar campos de MDR según la marca y MCC.
 * Endpoint: PUT /card-brand-mdr/update/:cardBrand/mcc/:mcc
 */
const updateMerchantsDiscountRateByCardBrandAndMccController = async (req, res, next) => {
  logger.info('Inicio del controlador updateMerchantsDiscountRateByCardBrandAndMccController');
  try {
    const { cardBrand, mcc } = req.params;
    // El body contendrá los campos a actualizar (rate, uf, etc.)
    const updateData = req.body;

    const result = await updateMerchantsDiscountRateByCardBrandAndMccModule(cardBrand, mcc, updateData);

    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa de updateMerchantsDiscountRateByCardBrandAndMccController');
    return res.status(200)
      .json({
        message: 'Registro actualizado correctamente.',
        updatedData: result,
      });
  } catch (error) {
    logger.error(
      `Error en updateMerchantsDiscountRateByCardBrandAndMccController: ${error.message}`,
      error
    );
    return handleNextError(
      error,
      next,
      'CARD_BRAND_MDR.UPDATE_BY_BRAND.0005',
      'Error desconocido al actualizar la tasa de descuento para la marca de tarjeta especificada.'
    );
  }
};

/**
 * NUEVO Controlador para eliminar un registro por marca y MCC.
 * Endpoint: DELETE /card-brand-mdr/delete/:cardBrand/mcc/:mcc
 */
const deleteMerchantsDiscountRateByCardBrandAndMccController = async (req, res, next) => {
  logger.info('Inicio del controlador deleteMerchantsDiscountRateByCardBrandAndMccController');
  try {
    const { cardBrand, mcc } = req.params;

    await deleteMerchantsDiscountRateByCardBrandAndMccModule(cardBrand, mcc);

    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "script-src 'self'");

    logger.info('Finalización exitosa de deleteMerchantsDiscountRateByCardBrandAndMccController');
    return res
      .status(200)
      .json({
        message: `Registro MCC=${mcc} de la marca '${cardBrand}' eliminado correctamente.`,
      });
  } catch (error) {
    logger.error(
      `Error en deleteMerchantsDiscountRateByCardBrandAndMccController: ${error.message}`,
      error
    );
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
