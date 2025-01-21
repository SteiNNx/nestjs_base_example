// src/components/card_brand_mdr/card_brand_mdr.controller.js

/**
 * Módulo que orquesta la obtención de tasas de descuento para comerciantes (MDR).
 * Conecta el controlador con el módulo correspondiente.
 *
 * @module cardBrandMdrController
 */

const { getAllMerchantsDiscountRateModule } = require('./card_brand_mdr.module');
const { handleNextError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('card_brand_mdr.controller.js');

/**
 * Controlador que orquesta la obtención de todas las tasas de descuento para comerciantes (MDR).
 * Se encarga de invocar el módulo que realiza la lógica de negocio y gestionar los errores
 * durante el proceso, retornando la información obtenida mediante una respuesta HTTP segura.
 *
 * En la respuesta se configuran cabeceras de seguridad, tales como:
 * - `Strict-Transport-Security`: para forzar el uso de HTTPS.
 * - `Content-Security-Policy`: para restringir el origen de ciertos recursos (por ejemplo, scripts).
 *
 * @async
 * @function getAllMerchantsDiscountRateController
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @param {import('express').Response} res - Objeto de respuesta HTTP de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<import('express').Response>} Respuesta HTTP con el resultado en formato JSON.
 * @throws {Error} Lanza el error para que sea manejado por el middleware de errores.
 */
const getAllMerchantsDiscountRateController = async (req, res, next) => {
  logger.info('Inicio del controlador getAllMerchantsDiscountRateController');

  try {
    // =======================================================================
    // Invocar el módulo de lógica de negocio para obtener las tasas MDR
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

module.exports = {
  getAllMerchantsDiscountRateController,
};
