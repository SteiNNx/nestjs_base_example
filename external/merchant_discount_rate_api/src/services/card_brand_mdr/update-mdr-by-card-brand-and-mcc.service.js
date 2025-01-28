// src/services/update-merchants-discount-rate-by-card-brand-and-mcc.service.js

const MdrAmexRepository = require('../../db/repositories/mdr_amex.repository');
const MdrDiscoverRepository = require('../../db/repositories/mdr_discover.repository');
const MdrMastercardRepository = require('../../db/repositories/mdr_mastercard.repository');
const MdrVisaRepository = require('../../db/repositories/mdr_visa.repository');
const { handleThrownError } = require('../../providers/error-handler.provider');
const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('update-merchants-discount-rate-by-card-brand-and-mcc.service.js');

/**
 * Actualiza varios campos de un registro en la tabla de la marca especificada (1 sola llamada a DynamoDB).
 *
 * @param {string} cardBrand - "amex", "discover", "mastercard", o "visa"
 * @param {string} mcc - MCC que identifica el registro en la tabla
 * @param {Object} updateData - Objeto con los campos a actualizar, p. ej. { "debito_nacional_presencial_smartpos_rate": 1.90, ... }
 * @returns {Promise<Object>} El resultado de la operación (ej: { success: true, updatedFields: [] })
 */
const updateMerchantsDiscountRateByCardBrandAndMccService = async (cardBrand, mcc, updateData) => {
    logger.info(`Inicio updateMerchantsDiscountRateByCardBrandAndMccService: marca=${cardBrand}, mcc=${mcc}`);

    let repository;
    switch (cardBrand.toLowerCase()) {
        case 'amex':
            repository = new MdrAmexRepository();
            break;
        case 'discover':
            repository = new MdrDiscoverRepository();
            break;
        case 'mastercard':
            repository = new MdrMastercardRepository();
            break;
        case 'visa':
            repository = new MdrVisaRepository();
            break;
        default:
            const err = new Error(`La marca de tarjeta '${cardBrand}' no está soportada para update.`);
            logger.error(err.message);
            throw err;
    }

    try {
        const result = await repository.updateMultipleFields(mcc, updateData);
        logger.info('Actualización realizada con éxito (un solo updateItem en DynamoDB).');
        return result;
    } catch (error) {
        logger.error(`Error actualizando ${cardBrand}, mcc=${mcc}: ${error.message}`, error);
        return handleThrownError(
            error,
            'MDR.UPDATE_BY_BRAND',
            `Error al actualizar registro MCC=${mcc} en la marca ${cardBrand}.`
        );
    }
};

module.exports = {
    updateMerchantsDiscountRateByCardBrandAndMccService,
};
