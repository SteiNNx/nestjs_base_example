// src/services/delete-merchants-discount-rate-by-card-brand-and-mcc.service.js

/**
 * Servicio para eliminar registros de MDR según la marca y el MCC.
 *
 * @module deleteMerchantsDiscountRateByCardBrandAndMccService
 */

const MdrAmexRepository = require('../../db/repositories/mdr_amex.repository');
const MdrDiscoverRepository = require('../../db/repositories/mdr_discover.repository');
const MdrMastercardRepository = require('../../db/repositories/mdr_mastercard.repository');
const MdrVisaRepository = require('../../db/repositories/mdr_visa.repository');

const { handleThrownError } = require('../../providers/error-handler.provider');
const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('delete-merchants-discount-rate-by-card-brand-and-mcc.service.js');

/**
 * Elimina un registro (MCC) en la tabla de la marca especificada.
 *
 * @async
 * @function deleteMerchantsDiscountRateByCardBrandAndMccService
 * @param {string} cardBrand - "amex", "discover", "mastercard", o "visa"
 * @param {string} mcc - El MCC que identifica el registro en DynamoDB
 * @returns {Promise<void>}
 */
const deleteMerchantsDiscountRateByCardBrandAndMccService = async (cardBrand, mcc) => {
    logger.info(`Inicio del servicio deleteMerchantsDiscountRateByCardBrandAndMccService: marca=${cardBrand}, mcc=${mcc}`);

    let repository = null;
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
        default: {
            const err = new Error(`La marca de tarjeta '${cardBrand}' no está soportada para delete.`);
            logger.error(err.message);
            throw err;
        }
    }

    try {
        await repository.delete(mcc);
        logger.info(`Registro MCC=${mcc} eliminado correctamente en la marca ${cardBrand}`);
    } catch (error) {
        logger.error(`Error eliminando ${cardBrand}, mcc=${mcc}: ${error.message}`, error);
        return handleThrownError(
            error,
            'MDR.DELETE_BY_BRAND',
            `Error al eliminar registro MCC=${mcc} en la marca ${cardBrand}.`
        );
    }
};

module.exports = {
    deleteMerchantsDiscountRateByCardBrandAndMccService,
};
