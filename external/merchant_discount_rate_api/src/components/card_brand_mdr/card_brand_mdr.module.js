// src/components/card_brand_mdr/card_brand_mdr.module.js

/**
 * Módulo para la orquestación de la obtención y modificación de tasas de descuento (MDR).
 *
 * @module cardBrandMdrModule
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
 * Orquesta la obtención de las tasas de descuento para todas las marcas.
 */
const getAllMerchantsDiscountRateModule = async (req) => {
  logger.info('Inicio del módulo getAllMerchantsDiscountRateModule');
  const result = await getAllMerchantsDiscountRateService(req);
  logger.info('Finalización exitosa del módulo getAllMerchantsDiscountRateModule');
  return result;
};

/**
 * Orquesta la obtención de las tasas de descuento (MDR) para una marca de tarjeta específica.
 */
const getAllMerchantsDiscountRateByCardBrandModule = async (cardBrand) => {
  logger.info(`Inicio del módulo getAllMerchantsDiscountRateByCardBrandModule para ${cardBrand}`);
  const result = await getAllMerchantsDiscountRateByCardBrandService(cardBrand);
  logger.info(`Finalización exitosa del módulo getAllMerchantsDiscountRateByCardBrandModule para ${cardBrand}`);
  return result;
};

const updateMerchantsDiscountRateByCardBrandAndMccModule = async (cardBrand, mcc, updateData) => {
  logger.info(`Inicio del módulo updateMerchantsDiscountRateByCardBrandAndMccModule para ${cardBrand}, mcc=${mcc}`);
  validateBodySchema(updateData, mdrUpdateSchema, 'XXX.XXX.0001');
  const result = await updateMerchantsDiscountRateByCardBrandAndMccService(cardBrand, mcc, updateData);
  logger.info(`Finalización exitosa del módulo updateMerchantsDiscountRateByCardBrandAndMccModule para ${cardBrand}, mcc=${mcc}`);
  return result;
};

const deleteMerchantsDiscountRateByCardBrandAndMccModule = async (cardBrand, mcc) => {
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
