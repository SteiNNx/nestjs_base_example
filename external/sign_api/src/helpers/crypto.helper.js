// src/helpers/crypto.helper.js

const crypto = require('crypto');

/**
 * Cifra un texto plano usando AES-128-CBC
 *
 * @param {string} plainText - Texto plano a cifrar
 * @param {string} encryptionKeyHex - Clave en formato hex (16 bytes -> 128 bits)
 * @param {string} encryptionIvHex - Vector de inicialización en formato hex (16 bytes -> 128 bits)
 * @returns {string} - Texto cifrado en base64
 */
function encrypt(plainText, encryptionKeyHex, encryptionIvHex) {
    const key = Buffer.from(encryptionKeyHex, 'hex');
    const iv = Buffer.from(encryptionIvHex, 'hex');

    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return encrypted;
}

/**
 * Descifra un texto cifrado usando AES-128-CBC
 *
 * @param {string} encryptedTextBase64 - Texto cifrado en base64
 * @param {string} encryptionKeyHex - Clave en formato hex (16 bytes -> 128 bits)
 * @param {string} encryptionIvHex - Vector de inicialización en formato hex (16 bytes -> 128 bits)
 * @returns {string} - Texto descifrado en UTF-8
 */
function decrypt(encryptedTextBase64, encryptionKeyHex, encryptionIvHex) {
    const key = Buffer.from(encryptionKeyHex, 'hex');
    const iv = Buffer.from(encryptionIvHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(encryptedTextBase64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {
    encrypt,
    decrypt,
};
