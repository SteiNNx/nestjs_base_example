// src/components/payment_mdr_applied/payment_mdr_applied.module.js

/**
 * Módulo para la orquestación de la creación de un registro de Payment Merchant Discount Rate Applied.
 *
 * @module paymentMdrAppliedModule
 */

const validateBodySchema = require('../../helpers/validate.helper');
const addPaymentMdrAppliedSchema = require('../../schemas/request/add-payment-mdr-applied.schema');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('payment_mdr_applied.module.js');

const { addPaymentMerchantDiscountRateAppliedService } = require('../../services/payment_mdr_applied/add-payment-merchant-discount-rate-applied.service');

/**
 * Orquesta la creación de un registro de Payment Merchant Discount Rate Applied.
 * Valida el cuerpo de la petición y llama al servicio correspondiente.
 *
 * @param {Object} req - Request object.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const AddPaymentMerchantDiscountRateAppliedModule = async (req) => {
    logger.info('Inicio del módulo AddPaymentMerchantDiscountRateAppliedModule');
    const addData = req.body;
    validateBodySchema(addData, addPaymentMdrAppliedSchema, 'XXX.XXX.0001');
    const result = await addPaymentMerchantDiscountRateAppliedService(req, addData);
    logger.info('Finalización exitosa del módulo AddPaymentMerchantDiscountRateAppliedModule');
    return result;
};

module.exports = {
    AddPaymentMerchantDiscountRateAppliedModule,
};
