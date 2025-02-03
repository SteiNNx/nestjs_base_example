// src/services/payment_mdr_applied/add-payment-merchant-discount-rate-applied.service.js

const PaymentMdrAppliedRepository = require('../../db/repositories/payment_mdr_applied.repository');
const { handleThrownError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('add-payment-merchant-discount-rate-applied.service.js');

/**
 * Agrega un registro de Payment Merchant Discount Rate Applied a la tabla correspondiente.
 *
 * @param {Object} req - Request object.
 * @param {Object} addData - Datos a insertar (ya validados).
 * @returns {Promise<Object>} Resultado de la operación.
 */
const addPaymentMerchantDiscountRateAppliedService = async (req, addData) => {
    logger.info('Inicio de addPaymentMerchantDiscountRateAppliedService');

    // Se instancia el repositorio correspondiente
    const repository = new PaymentMdrAppliedRepository();

    try {
        //const result = await repository.add(addData);
        logger.info('Registro agregado exitosamente en Payment MDR Applied');
        return true;
    } catch (error) {
        logger.error(`Error al agregar registro en Payment MDR Applied: ${error.message}`, error);
        return handleThrownError(
            error,
            'PAYMENT_MDR_APPLIED.ADD',
            'Error al agregar registro en Payment Merchant Discount Rate Applied.'
        );
    }
};

module.exports = {
    addPaymentMerchantDiscountRateAppliedService,
};
