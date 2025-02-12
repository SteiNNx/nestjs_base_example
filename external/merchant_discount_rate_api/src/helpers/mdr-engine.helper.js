const LoggerHelper = require('../helpers/logger.helper');
const { getCurrentSlashDdMmYyyyHhMmSs } = require('./dayjs.helper');
const logger = new LoggerHelper('mdr-engine.helper.js');

/**
 * Calcula la comisión (o descuento) asociada a la transacción,
 * basándose en la información de la tarjeta y en el registro
 * de tasas disponibles.
 *
 * @async
 * @function computeCommissionCA
 * @param {Object} addData - Datos de la transacción (ej. tipo de tarjeta, canal, monto, etc.).
 * @param {Object} brandMdrRecord - Registro con las tasas de MDR por combinación de tarjeta / nacionalidad / canal.
 * @returns {Promise<Object>} Objeto con la información calculada del descuento:
 *   - amount: {number} Monto original de la transacción.
 *   - amountDiscountApplicated: {number} Monto resultante después de aplicar el descuento.
 *   - discountAmount: {number} Valor del descuento calculado.
 *   - discountRateApplicated: {number} Porcentaje de la tasa aplicada.
 */
const computeCommissionCA = async (addData, brandMdrRecord) => {
    try {
        logger.info(`Información recibida en addData: ${JSON.stringify(addData)}`);
        logger.info(`Información recibida en brandMdrRecord: ${JSON.stringify(brandMdrRecord)}`);

        // Mapas para normalizar valores de card_type, etc.
        const cardTypeMap = {
            'debito': 'debito',
            'credito': 'credito',
        };

        const cardTypeNatIntMap = {
            'nacional': 'nacional',
            'internacional': 'internacional'
        };

        const channelMap = {
            'smartpos': 'presencial_smartpos',
            'integrado': 'integrado_presencial',
            'ecommerce': 'ecommerce_online'
        };

        // Construimos las llaves (rateKey, ufKey)
        const cardType = cardTypeMap[addData.card_type.toLowerCase()];
        const cardTypeNatInt = cardTypeNatIntMap[addData.card_type_national_international.toLowerCase()];
        const channelKey = channelMap[addData.channel.toLowerCase()];
        const rateKey = `${cardType}_${cardTypeNatInt}_${channelKey}_rate`;
        const ufKey = `${cardType}_${cardTypeNatInt}_${channelKey}_uf`;

        logger.info(`Tipo de tarjeta (cardType): ${cardType}`);
        logger.info(`Nacional/Internacional (cardTypeNatInt): ${cardTypeNatInt}`);
        logger.info(`Canal determinado (channelKey): ${channelKey}`);
        logger.info(`Clave para tasa (rateKey): ${rateKey}`);
        logger.info(`Clave para UF (ufKey): ${ufKey}`);

        // Obtenemos la tasa y la UF
        const discountRate = brandMdrRecord[rateKey]
            ? parseFloat(brandMdrRecord[rateKey])
            : 0;
        const discountUf = brandMdrRecord[ufKey]
            ? parseFloat(brandMdrRecord[ufKey])
            : 0;

        // Podemos crear una constante para la tasa en factor decimal
        const discountRateFactor = discountRate / 100;

        logger.info(`Monto de la transacción (amount): ${addData.amount}`);
        logger.info(`Tasa de descuento encontrada (en %): ${discountRate}`);
        logger.info(`Factor aplicado (discountRateFactor): ${discountRateFactor}`);
        logger.info(`Valor de UF (discountUf): ${discountUf}`);

        // discountAmount = (discountRate% de amount) + discountUf
        // 1.70% -> discountRateFactor = 1.70/100
        const discountAmount = parseFloat(
            ((discountRateFactor) * addData.amount + discountUf).toFixed(2)
        );
        const amountDiscountApplicated = parseFloat((addData.amount - discountAmount).toFixed(2));

        logger.info(`Cálculo detallado del descuento: (monto * factor) + UF = (${addData.amount} * ${discountRateFactor}) + ${discountUf}`);
        logger.info(`Monto (amount): ${addData.amount}`);
        logger.info(`Descuento calculado (discountAmount): ${discountAmount}`);
        logger.info(`Monto Descuento aplicado (amountDiscountApplicated): ${amountDiscountApplicated}`);

        // Armamos la respuesta final: agregamos campo 'amountDiscountApplicated'
        // que representa el monto que queda tras aplicar el descuento.
        const result = {
            amount: addData.amount,
            amountDiscountApplicated: amountDiscountApplicated,
            discountAmount: discountAmount,
            discountRateApplicated: discountRate,
            discountUfApplicated: discountUf,
            rateKeyApplicated: rateKey,
            ufKeyApplicated: ufKey,
        };

        logger.info(`Resultado final de computeCommissionCA: ${JSON.stringify(result)}`);

        logger.info("FIN de computeCommissionCA");
        return result;

    } catch (error) {
        logger.error("****************************************************");
        logger.error(`Error en computeCommissionCA: ${error.message}`);
        logger.error("****************************************************");
        throw error;
    }
};

/**
 * Genera un objeto de "payment commission" para CA (Cuenta Corriente),
 * incorporando los datos de la transacción, montos y fechas en UTC y 
 * zona horaria local de Santiago (Chile) a partir de la misma fecha base.
 *
 * @async
 * @function generateItemPaymentCommissionCA
 * @param {Object} addData - Datos originales de la transacción.
 * @param {number} amount - Monto original de la transacción.
 * @param {number} amountDiscountApplicated - Monto resultante luego de aplicar descuento.
 * @param {number} discountAmount - Monto del descuento calculado.
 * @param {number} discountRateApplicated - Tasa de descuento aplicada (en %).
 * @returns {Promise<Object>} Objeto `addData` enriquecido con los campos adicionales.
 */
const generateItemPaymentCommissionCA = async (
    addData,
    amount,
    amountDiscountApplicated,
    discountAmount,
    discountRateApplicated,
    discountUfApplicated,
    rateKeyApplicated,
    ufKeyApplicated,

) => {
    // Incorporamos los valores en el objeto addData

    // Obtenemos la fecha/hora local de Santiago (Chile) en español
    const fechaLocalCL = getCurrentSlashDdMmYyyyHhMmSs();
    const fechaUTC = getCurrentSlashDdMmYyyyHhMmSs(true);

    return {
        transaction_id: addData.transaction_id,
        channel: channelKey,
        response_code: addData.response_code,
        card_number: addData.card_number,
        card_type: addData.card_type,
        card_type_nat_int: addData.card_type_national_international,
        timestamp: addData.timestamp,
        merchant_id: addData.merchant_id,
        merchant_name: addData.merchant.name,
        merchant_mcc: addData.mcc,
        transaction_type: addData.transaction_type,
        issuer_bank_id: addData.issuer.bank_id,

        card_brand: addData.card_brand,
        currency: addData.currency,
        amount: amount,
        discount_rate_applicated: discountRateApplicated,
        discount_amount: discountAmount,
        amount_discount_applicated: amountDiscountApplicated,
        discount_uf_applicated: discountUfApplicated,
        rate_key_applicated: rateKeyApplicated,
        uf_key_applicated: ufKeyApplicated,
        mdr_fecha_local: fechaLocalCL,
        mdr_fecha_utc: fechaUTC,
    };
};

module.exports = {
    computeCommissionCA,
    generateItemPaymentCommissionCA,
};
