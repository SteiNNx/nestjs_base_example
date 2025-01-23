// src/helpers/bcrypt.helper.js

/**
 * @file bcrypt.helper.js
 * @description Utilidades para encriptar (hash) y verificar contraseñas utilizando bcrypt con un pepper.
 *
 * El proceso consiste en concatenar la contraseña con un valor secreto (pepper) definido en la configuración
 * obtenida a través de credentials.provider, y luego aplicar bcrypt.
 */

const bcrypt = require('bcrypt');
const { getBcryptPasswordConfig } = require('../providers/credentials.provider');

const LoggerHelper = require('./logger.helper');
const TechnicalError = require('../exceptions/technical.exception');
const logger = new LoggerHelper('bcrypt.helper');

/**
 * Genera un hash seguro para una contraseña utilizando bcrypt y un pepper.
 *
 * @async
 * @function hashPassword
 * @param {string} password - La contraseña en texto plano.
 * @returns {Promise<string>} El hash resultante.
 * @throws {Error} Si ocurre un error durante el hashing.
 * @example
 * const hash = await hashPassword('miPasswordSeguro123');
 */
async function hashPassword(password) {
    try {
        const { pepperKey, saltRounds } = getBcryptPasswordConfig();
        // Concatenamos la contraseña con el pepper antes de generar el hash
        const passwordWithPepper = password + pepperKey;
        const hashedPassword = await bcrypt.hash(passwordWithPepper, saltRounds);
        return hashedPassword;
    } catch (error) {
        logger.error(`Error al generar el hash: ${error.message}`, error);
        throw new TechnicalError('BCRYPT.HASHPASSWORD', 'Error al ejecutar bcrypt.hash.', 500, error);
    }
}

/**
 * Verifica que una contraseña en texto plano coincida con un hash almacenado.
 *
 * @async
 * @function verifyPassword
 * @param {string} password - La contraseña en texto plano a verificar.
 * @param {string} hash - El hash almacenado.
 * @returns {Promise<boolean>} `true` si la contraseña es correcta; de lo contrario, `false`.
 * @throws {Error} Si ocurre un error durante la verificación.
 * @example
 * const isValid = await verifyPassword('miPasswordSeguro123', storedHash);
 */
async function verifyPassword(password, hash) {
    try {
        const { pepperKey } = getBcryptPasswordConfig();
        // Concatenamos la contraseña recibida con el pepper antes de comparar
        const passwordWithPepper = password + pepperKey;
        const isValid = await bcrypt.compare(passwordWithPepper, hash);
        return isValid;
    } catch (error) {
        logger.error(`Error al verificar la contraseña: ${error.message}`, error);
        throw new TechnicalError('BCRYPT.VERIFYPASSWORD', 'Error al ejecutar bcrypt.compare.', 500, error);
    }
}

module.exports = {
    hashPassword,
    verifyPassword
};
