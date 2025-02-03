// src/services/payment_mdr_applied/add-payment-merchant-discount-rate-applied.service.js

const PaymentMdrAppliedRepository = require('../../db/repositories/payment_mdr_applied.repository');
const { handleThrownError } = require('../../providers/error-handler.provider');

const MdrAmexRepository = require('../../db/repositories/mdr_amex.repository');
const MdrDiscoverRepository = require('../../db/repositories/mdr_discover.repository');
const MdrMastercardRepository = require('../../db/repositories/mdr_mastercard.repository');
const MdrVisaRepository = require('../../db/repositories/mdr_visa.repository');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('add-payment-merchant-discount-rate-applied.service.js');

/**
 * Agrega un registro de Payment Merchant Discount Rate Applied a la tabla correspondiente.
 *
 * @param {Object} addData - Datos a insertar (ya validados por Zod).
 *   Ejemplo de addData:
 *   {
 *     "transaction_id": "...",
 *     "timestamp": "2025-01-10T12:30:00Z",
 *     "card_brand": "MasterCard",
 *     "mcc": "5411",
 *     ...
 *   }
 * @returns {Promise<boolean>} true si se procesó correctamente, o lanza un error en caso de fallo.
 */
const addPaymentMerchantDiscountRateAppliedService = async (addData) => {
  logger.info('Inicio de addPaymentMerchantDiscountRateAppliedService');

  // 1) Instanciamos repositorio principal (para Payment MDR Applied).
  const paymentMdrAppliedRepository = new PaymentMdrAppliedRepository();

  logger.warn(`Marca de tarjeta : ${addData.card_brand}. `);
  logger.warn(`Mcc de tarjeta : ${addData.mcc}. `);

  // 2) Determinamos el repositorio según la marca de la tarjeta (card_brand).
  let brandRepository;
  switch ((addData.card_brand || '').toLowerCase()) {
    case 'amex':
      brandRepository = new MdrAmexRepository();
      break;

    case 'discover':
      brandRepository = new MdrDiscoverRepository();
      break;

    case 'visa':
      brandRepository = new MdrVisaRepository();
      break;

    case 'mastercard':
      brandRepository = new MdrMastercardRepository();
      break;

    default:
      logger.warn(`Marca de tarjeta no soportada: ${addData.card_brand}. Se omite MDR específico.`);
      break;
  }

  try {
    // 3) Si pudimos identificar un repositorio de brand, buscamos la tasa según MCC.
    if (brandRepository) {
      logger.info(`Buscando MDR para brand=${addData.card_brand}, mcc=${addData.mcc}`);
      const brandMdrRecord = await brandRepository.getByMcc(addData.mcc);

      if (brandMdrRecord) {
        logger.info(`Registro MDR encontrado para ${addData.card_brand}, MCC=${addData.mcc}`);
        // Aquí podrías extraer la tasa que necesites, por ejemplo:
        // const { debit_nacional_rate } = brandMdrRecord;
        // addData.rateApplied = parseFloat(debit_nacional_rate?.N) || 0;
        //
        // O guardar en la tabla Payment MDR Applied la tasa
        // etc.
      } else {
        logger.warn(`No se encontró MDR para brand=${addData.card_brand}, MCC=${addData.mcc}`);
      }
    }

    // 4) Insertar o procesar la data en Payment MDR Applied (repositorio principal).
    // Por ejemplo, si quisieras guardar addData con la tasa, podrías hacer:
    // const result = await paymentMdrAppliedRepository.add(addData);
    // logger.info(`Registro agregado exitosamente en Payment MDR Applied, result: ${JSON.stringify(result)}`);

    logger.info('Fin de addPaymentMerchantDiscountRateAppliedService');
    return true;
  } catch (error) {
    logger.error(`Error al agregar registro en Payment MDR Applied: ${error.message}`, error);
    throw handleThrownError(
      error,
      'PAYMENT_MDR_APPLIED.ADD',
      'Error al agregar registro en Payment Merchant Discount Rate Applied.'
    );
  }
};

module.exports = {
  addPaymentMerchantDiscountRateAppliedService,
};
