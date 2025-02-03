// src/components/payment_mdr_applied/payment_mdr_applied.module.js

/**
 * @module paymentMdrAppliedModule
 * @description Módulo que orquesta la creación de un registro de Payment Merchant Discount Rate Applied.
 * Valida el body de la solicitud usando un esquema Zod y llama al servicio correspondiente.
 */
const { addPaymentMerchantDiscountRateAppliedService } = require('../../services/payment_mdr_applied/add-payment-mdr-applied.service');

const validateBodySchema = require('../../helpers/validate.helper');
const addPaymentMdrAppliedSchema = require('../../schemas/request/add-payment-mdr-applied.schema');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('payment_mdr_applied.module.js');


/**
 * @async
 * @function AddPaymentMerchantDiscountRateAppliedModule
 * @description Orquesta la creación de un registro de Payment Merchant Discount Rate Applied. Valida el cuerpo de la solicitud y llama al servicio encargado de agregar el registro.
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @returns {Promise<Object>} Objeto con el resultado de la operación, generalmente un mensaje de éxito y los datos insertados.
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
