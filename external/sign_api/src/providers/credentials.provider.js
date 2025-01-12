// src/providers/credentials.provider.js

const fs = require('fs');
const { config } = require('../config/config.js');

const AdapterError = require('../exceptions/adapter.exception');
const TechnicalError = require('../exceptions/technical.exception');
const LoggerHelper = require('../helpers/logger.helper.js');

const logger = new LoggerHelper('credentials.provider');

/**
 * Carga las credenciales (privateKey, certificate) desde paths en config.
 * @returns {Object} { privateKey, certificate }
 * @throws {AdapterError}
 */
const loadCredentials = () => {
    const { privateKeyPath, certificatePath } = config;
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
}

module.exports = {
    loadCredentials,
};
