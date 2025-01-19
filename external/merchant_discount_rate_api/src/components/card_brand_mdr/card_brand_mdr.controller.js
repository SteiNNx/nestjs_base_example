// src/components/card_brand_mdr/card_brand_mdr.controller.js

/**
 * Módulo que orquesta la obtención de tasas de descuento para comerciantes (MDR).
 * Conecta el controlador con el módulo correspondiente.
 *
 * @module cardBrandMdrController
 */

const { getAllMerchantsDiscountRateModule } = require('../../services/card_brand_mdr.module');
const { handleNextError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('card_brand_mdr.controller.js');

/**
 * Controlador que orquesta la obtención de todas las tasas de descuento para comerciantes.
 *
 * Se encarga de invocar el módulo que realiza la lógica de negocio para la obtención
 * de los datos MDR y gestionar los posibles errores durante el proceso.
 *
 * @async
 * @function getAllMerchantsDiscountRateController
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @param {import('express').Response} res - Objeto de respuesta HTTP de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<Object>} Objeto que contiene la información resultante del proceso.
 * @throws {Error} Lanza el error para que sea manejado por el middleware de errores.
 */
const getAllMerchantsDiscountRateController = async (req, res, next) => {
  logger.info('Inicio del controlador getAllMerchantsDiscountRateController');

  try {
    const result = await getAllMerchantsDiscountRateModule(req);
    logger.info('Finalización exitosa del controlador getAllMerchantsDiscountRateController');
    return result;
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

module.exports = {
  getAllMerchantsDiscountRateController,
};
