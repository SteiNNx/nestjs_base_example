// src/xmlUtils.js
const xmlbuilder = require('xmlbuilder');

/**
 * Convierte un objeto JSON a XML.
 * @param {Object} json - Objeto JSON a convertir.
 * @param {String} rootName - Nombre del elemento raíz en el XML.
 * @returns {String} - Cadena XML resultante.
 */
function jsonToXml(json, rootName = 'Payment') {
    const xml = xmlbuilder.create(rootName);
    for (const key in json) {
        if (Object.prototype.hasOwnProperty.call(json, key)) {
            const value = json[key];
            if (typeof value === 'object' && value !== null) {
                const child = xml.ele(key);
                Object.keys(value).forEach((subKey) => {
                    child.ele(subKey, value[subKey]);
                });
            } else {
                xml.ele(key, value);
            }
        }
    }
    return xml.end({ pretty: true });
}

module.exports = {
    jsonToXml,
};
