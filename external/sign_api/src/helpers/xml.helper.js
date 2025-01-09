// src/helpers/xml.helper.js

const TechnicalError = require('../exceptions/technical.exception');

const { DOMParser } = require('xmldom');
const xmlbuilder = require('xmlbuilder');

/**
 * Utilidades para convertir objetos JSON a XML y viceversa.
 *
 * @module xmlHelper
 */

/**
 * Convierte un objeto JSON a XML.
 *
 * @param {Object} json - Objeto JSON a convertir.
 * @param {String} [rootName='Payment'] - Nombre del elemento raíz en el XML.
 * @returns {String} Cadena XML resultante.
 * @throws {TechnicalError} Si ocurre un error durante la conversión.
 *
 * @example
 * const json = { amount: 100, currency: 'USD' };
 * const xml = xmlHelper.jsonToXml(json, 'Transaction');
 * console.log(xml);
 */
const jsonToXml = (json, rootName = 'Payment') => {
  try {
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
  } catch (error) {
    throw new TechnicalError('XML.XML_CONVERSION', 'Error al convertir JSON a XML.', 500, error);
  }
};

/**
 * Convierte un string con formato XML a un Document.
 *
 * @link https://developer.mozilla.org/es/docs/Web/API/Document
 * @param {String} xmlString - La cadena XML a convertir.
 * @returns {Document} Documento XML parseado.
 * @throws {TechnicalError} Si ocurre un error durante el parsing del XML.
 *
 * @example
 * const xmlString = '<Payment><amount>100</amount></Payment>';
 * const doc = xmlHelper.XmlToDocument(xmlString);
 * console.log(doc);
 */
const XmlToDocument = (xmlString) => {
  try {
    const doc = new DOMParser().parseFromString(xmlString, 'application/xml');
    const parseError = doc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error(parseError[0].textContent);
    }
    return doc;
  } catch (error) {
    throw new TechnicalError('XML.XML_PARSING', 'Error al parsear XML a Document.', 500, error);
  }
};

module.exports = {
  jsonToXml,
  XmlToDocument,
};
