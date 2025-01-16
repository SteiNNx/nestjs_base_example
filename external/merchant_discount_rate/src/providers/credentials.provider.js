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

/**
 * Carga las credenciales de autenticación (privateKey y publicKey) y la configuración asociada.
 *
 * @function getAuthConfig
 * @returns {Object} Objeto con las propiedades:
 *  - privateKey {String}: Clave privada de autenticación.
 *  - publicKey {String}: Clave pública de autenticación.
 *  - tokenExpiresIn {String}: Tiempo de expiración del token.
 *  - jwtAlgorithm {String}: Algoritmo de firma del token.
 * @throws {AdapterError} Si ocurre un error al leer alguno de los archivos.
 * @throws {TechnicalError} Si alguna de las llaves está vacía o ilegible.
 */
const getAuthConfig = () => {
    const { privateKeyPath, publicKeyPath, tokenExpiresIn, jwtAlgorithm } = config.auth;
    let privateKey = null;
    let publicKey = null;

    try {
        privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
        publicKey = fs.readFileSync(publicKeyPath, 'utf-8');
    } catch (error) {
        logger.error('[getAuthConfig] Error al leer llaves de autenticación: ' + error.message);
        throw new AdapterError(
            'AUTH.KEY_PEM_FILE_READ_ERROR',
            'Error al leer las llaves de autenticación.',
            502,
            error
        );
    }

    if (!privateKey || !privateKey.trim()) {
        logger.error('[getAuthConfig] La llave privada de autenticación está vacía o ilegible.');
        throw new TechnicalError(
            'AUTH.INVALID_PRIVATE_KEY_PEM_FILE',
            'La llave privada de autenticación está vacía o no se pudo leer correctamente.',
            500
        );
    }
    if (!publicKey || !publicKey.trim()) {
        logger.error('[getAuthConfig] La llave pública de autenticación está vacía o ilegible.');
        throw new TechnicalError(
            'AUTH.INVALID_PUBLIC_KEY_PEM_FILE',
            'La llave pública de autenticación está vacía o no se pudo leer correctamente.',
            500
        );
    }

    return { privateKey, publicKey, tokenExpiresIn, jwtAlgorithm };
};

/**
 * Retorna la clave de seguridad para el header de seguridad.
 *
 * @function getSecurityKey
 * @returns {String} La clave de seguridad definida en config.auth.headerSecurityKey.
 * @throws {TechnicalError} Si la clave de seguridad no se encuentra o es vacía.
 */
const getSecurityKey = () => {
    const securityKey = config.auth.headerSecurityKey;
    if (!securityKey || !securityKey.trim()) {
        logger.error('[getSecurityKey] La clave de seguridad está vacía o no se encontró.');
        throw new TechnicalError(
            'AUTH.INVALID_SECURITY_KEY',
            'La clave de seguridad de autenticación está vacía o no se encontró.',
            500
        );
    }
    return securityKey;
};

module.exports = {
    loadCredentials,
    getSignConfig,
    getAuthConfig,
    getSecurityKey
};
