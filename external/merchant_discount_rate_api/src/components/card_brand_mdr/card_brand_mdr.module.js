// src/components/card_brand_mdr/card_brand_mdr.module.js

/**
 * @module cardBrandMdrModule
 * @description Módulo para la orquestación de la obtención y modificación de tasas de descuento (MDR) para marcas de tarjetas.
 */

const { getAllMerchantsDiscountRateService } = require('../../services/card_brand_mdr/get-all-mdr.service');
const { getAllMerchantsDiscountRateByCardBrandService } = require('../../services/card_brand_mdr/get-all-mdr-by-card-brand.service');
const { updateMerchantsDiscountRateByCardBrandAndMccService } = require('../../services/card_brand_mdr/update-mdr-by-card-brand-and-mcc.service');
const { deleteMerchantsDiscountRateByCardBrandAndMccService } = require('../../services/card_brand_mdr/delete-mdr-by-card-brand-and-mcc.service');

const validateBodySchema = require('../../helpers/validate.helper');
const mdrUpdateSchema = require('../../schemas/request/mdr-update.schema');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('card_brand_mdr.module.js');

/**
 * @async
 * @function getAllMerchantsDiscountRateModule
 * @description Orquesta la obtención de las tasas de descuento para todas las marcas.
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @returns {Promise<Object>} Resultado obtenido por el servicio.
 */
const getAllMerchantsDiscountRateModule = async (req) => {
  logger.info('Inicio del módulo getAllMerchantsDiscountRateModule');
  const result = await getAllMerchantsDiscountRateService(req);
  logger.info('Finalización exitosa del módulo getAllMerchantsDiscountRateModule');
  return result;
};

/**
 * @async
 * @function getAllMerchantsDiscountRateByCardBrandModule
 * @description Orquesta la obtención de las tasas de descuento (MDR) para una marca de tarjeta específica.
 * @param {import('express').Request} req - Objeto de solicitud HTTP, se espera que req.params.cardBrand esté definido.
 * @returns {Promise<Object>} Resultado obtenido por el servicio.
 */
const getAllMerchantsDiscountRateByCardBrandModule = async (req) => {
  const { cardBrand } = req.params;
  logger.info(`Inicio del módulo getAllMerchantsDiscountRateByCardBrandModule para ${cardBrand}`);
  const result = await getAllMerchantsDiscountRateByCardBrandService(cardBrand);
  logger.info(`Finalización exitosa del módulo getAllMerchantsDiscountRateByCardBrandModule para ${cardBrand}`);
  return result;
};

/**
 * @async
 * @function updateMerchantsDiscountRateByCardBrandAndMccModule
 * @description Orquesta la actualización de uno o varios campos de la tasa de descuento para una marca y un MCC específicos.
 * @param {import('express').Request} req - Objeto de solicitud HTTP; se espera que req.params.cardBrand y req.params.mcc estén definidos, y req.body contenga los datos a actualizar.
 * @returns {Promise<Object>} Resultado obtenido por el servicio.
 */
const updateMerchantsDiscountRateByCardBrandAndMccModule = async (req) => {
  const { cardBrand, mcc } = req.params;
  const updateData = req.body;

  logger.info(`Inicio del módulo updateMerchantsDiscountRateByCardBrandAndMccModule para ${cardBrand}, mcc=${mcc}`);
  validateBodySchema(updateData, mdrUpdateSchema, 'XXX.XXX.0001');
  const result = await updateMerchantsDiscountRateByCardBrandAndMccService(cardBrand, mcc, updateData);
  logger.info(`Finalización exitosa del módulo updateMerchantsDiscountRateByCardBrandAndMccModule para ${cardBrand}, mcc=${mcc}`);
  return result;
};

/**
 * @async
 * @function deleteMerchantsDiscountRateByCardBrandAndMccModule
 * @description Orquesta la eliminación del registro de tasa de descuento para una marca y MCC específicos.
 * @param {import('express').Request} req - Objeto de solicitud HTTP; se espera que req.params.cardBrand y req.params.mcc estén definidos.
 * @returns {Promise<void>} No retorna datos, sólo ejecuta la eliminación.
 */
const deleteMerchantsDiscountRateByCardBrandAndMccModule = async (req) => {
  const { cardBrand, mcc } = req.params;
  logger.info(`Inicio del módulo deleteMerchantsDiscountRateByCardBrandAndMccModule para ${cardBrand}, mcc=${mcc}`);
  await deleteMerchantsDiscountRateByCardBrandAndMccService(cardBrand, mcc);
  logger.info(`Finalización exitosa del módulo deleteMerchantsDiscountRateByCardBrandAndMccModule para ${cardBrand}, mcc=${mcc}`);
};

module.exports = {
  getAllMerchantsDiscountRateModule,
  getAllMerchantsDiscountRateByCardBrandModule,
  updateMerchantsDiscountRateByCardBrandAndMccModule,
  deleteMerchantsDiscountRateByCardBrandAndMccModule,
};
