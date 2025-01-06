// src/helpers/xml.helper.js

/**
 * Utilidades para convertir objetos JSON a XML y viceversa.
 *
 * @module xmlHelper
 */

const xmlbuilder = require('xmlbuilder');
const { DOMParser } = require('xmldom');

/**
 * Convierte un objeto JSON a XML.
 *
 * @param {Object} json - Objeto JSON a convertir.
 * @param {String} [rootName='Payment'] - Nombre del elemento raíz en el XML.
 * @returns {String} Cadena XML resultante.
 */
const jsonToXml = (json, rootName = 'Payment') => {
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
};

/**
 * Convierte un string con formato XML a un Document.
 *
 * @link https://developer.mozilla.org/es/docs/Web/API/Document
 * @param {String} xmlString - La cadena XML a convertir.
 * @returns {Document} Documento XML parseado.
 */
const XmlToDocument = (xmlString) => {
  return new DOMParser().parseFromString(xmlString);
};

module.exports = {
  jsonToXml,
  XmlToDocument,
};
