// src/providers/credentials.provider.js

const fs = require('fs');
const { config } = require('../config/config.js');

const AdapterError = require('../exceptions/adapter.exception');
const TechnicalError = require('../exceptions/technical.exception');
const LoggerHelper = require('../helpers/logger.helper.js');

const logger = new LoggerHelper('credentials.provider');

/**
 * Carga las credenciales (privateKey, certificate) desde los paths definidos en la configuración.
 *
 * @function loadCredentials
 * @returns {Object} Un objeto con las propiedades:
 *  - privateKey {String}: Clave privada.
 *  - certificate {String}: Certificado.
 * @throws {AdapterError} Si ocurre un error al leer los archivos.
 * @throws {TechnicalError} Si la llave privada está vacía o ilegible.
 */
const loadCredentials = () => {
    const { privateKeyPath, certificatePath } = config.sign;
    let privateKey = null;
    let certificate = null;
    try {
        privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
        certificate = fs.readFileSync(certificatePath, 'utf-8');
    } catch (error) {
        logger.error('[loadCredentials] Error al leer llaves/certificados: ' + error.message);
        throw new AdapterError(
            'CREDENTIALS.KEY_PEM_FILE_READ_ERROR',
            'Error al leer las llaves privadas o certificados.',
            502,
            error
        );
    }

    if (!privateKey || !privateKey.trim()) {
        logger.error('[loadCredentials] La llave privada está vacía o ilegible.');
        throw new TechnicalError(
            'CREDENTIALS.INVALID_PRIVATE_KEY_PEM_FILE',
            'La llave privada está vacía o no se pudo leer correctamente.',
            500
        );
    }
    return { privateKey, certificate };
};

/**
 * Retorna la configuración de firma a partir de los valores definidos en la configuración.
 * Extrae los siguientes parámetros:
 *  - canonicalizationAlgorithm
 *  - signatureAlgorithm
 *  - referenceTransformsFirst
 *  - referenceDigestAlgorithm
 *
 * @function getSignConfig
 * @returns {Object} Un objeto con la configuración de firma:
 *  - canonicalizationAlgorithm {String}: Algoritmo de canonicalización.
 *  - signatureAlgorithm {String}: Algoritmo de firma.
 *  - referenceTransformsFirst {String}: Primer transform a aplicar en la referencia.
 *  - referenceDigestAlgorithm {String}: Algoritmo de digest.
 * @throws {TechnicalError} Cuando alguno de los valores de configuración falta o es inválido.
 */
const getSignConfig = () => {
    const {
        canonicalizationAlgorithm,
        signatureAlgorithm,
        referenceTransformsFirst,
        referenceDigestAlgorithm
    } = config.sign;

    // Validamos que todos los parámetros de configuración estén presentes
    if (
        !canonicalizationAlgorithm ||
        !signatureAlgorithm ||
        !referenceTransformsFirst ||
        !referenceDigestAlgorithm
    ) {
        logger.error('[getSignConfig] Configuración de firma incompleta.');
        throw new TechnicalError(
            'SIGN.CONFIG_INCOMPLETE',
            'La configuración de firma está incompleta o contiene valores inválidos.',
            500
        );
    }

    return {
        canonicalizationAlgorithm,
        signatureAlgorithm,
        referenceTransformsFirst,
        referenceDigestAlgorithm
    };
};

module.exports = {
    loadCredentials,
    getSignConfig,
};
