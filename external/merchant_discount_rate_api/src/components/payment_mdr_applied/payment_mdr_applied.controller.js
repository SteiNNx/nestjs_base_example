// src/components/payment_mdr_applied/payment_mdr_applied.controller.js

/**
 * @module paymentMdrAppliedController
 */

const { AddPaymentMerchantDiscountRateAppliedModule } = require('./payment_mdr_applied.module');
const { handleNextError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('payment_mdr_applied.controller.js');

/**
 * Controlador para agregar un registro de Payment Merchant Discount Rate Applied.
 */
const AddPaymentMerchantDiscountRateAppliedController = async (req, res, next) => {
    logger.info('Inicio del controlador AddPaymentMerchantDiscountRateAppliedController');
    try {
        const result = await AddPaymentMerchantDiscountRateAppliedModule(req);

        // Agregar headers de seguridad
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "script-src 'self'");

        logger.info('Finalización exitosa de AddPaymentMerchantDiscountRateAppliedController');
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error en AddPaymentMerchantDiscountRateAppliedController: ${error.message}`, error);
        return handleNextError(
            error,
            next,
            'PAYMENT_MDR_APPLIED.ADDPAYMENTMDRAPPLIED.0005',
            'Error desconocido en el controlador de Payment Merchant Discount Rate Applied.'
        );
    }
};

module.exports = {
    AddPaymentMerchantDiscountRateAppliedController,
};
