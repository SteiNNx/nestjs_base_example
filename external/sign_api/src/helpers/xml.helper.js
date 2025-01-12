// src/helpers/xml.helper.js


const { DOMParser } = require('xmldom');
const xmlbuilder = require('xmlbuilder');

const TechnicalError = require('../exceptions/technical.exception');
const LoggerHelper = require('./logger.helper');

const logger = new LoggerHelper('xml.helper');

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

/**
 * Elimina saltos de línea, tabulaciones y espacios innecesarios entre etiquetas de un XML en forma de string.
 * Esta función deja el XML en una sola línea, concatenando las etiquetas.
 * 
 * @param {String} xmlString - Cadena que contiene el XML.
 * @returns {String} - Cadena sanitizada sin saltos de línea, tabulaciones ni espacios extra entre etiquetas.
 */
const sanitizaXml = (xmlString) => {
  if (!xmlString) {
    logger.info('[sanitizaXml] Recibió cadena nula o vacía, se retorna igual.');
    return xmlString;
  }

  // Log de la entrada (solo una parte si es muy grande)
  logger.info(`[sanitizaXml] Entrada (longitud=${xmlString.length}): ${xmlString.slice(0, 200)}...`);

  // 1. Elimina saltos de línea (\n, \r) y tabulaciones (\t)
  let sanitized = xmlString.replace(/[\n\r\t]+/g, '');
  // 2. Elimina espacios entre el cierre y apertura de etiquetas ( >   < )
  sanitized = sanitized.replace(/>\s+</g, '><');

  // Log de la salida
  logger.info(`[sanitizaXml] Salida (longitud=${sanitized.length}): ${sanitized.slice(0, 200)}...`);

  return sanitized;
}

/**
 * Función recursiva minimalista que convierte un elemento XML a un objeto JS.
 * - Si el elemento tiene atributos, se agregan como propiedades directas.
 * - Si el elemento tiene un único nodo de texto y no tiene atributos, se retorna el string.
 * - En caso de múltiples nodos hijos, se generan propiedades con los nombres de las etiquetas.
 * 
 * @param {Element} element - Elemento del DOM XML.
 * @returns {Object|String} - Representación en objeto del nodo o el contenido de texto.
 */
const parseElementToObjectMinimal = (element) => {
  let obj = {};

  // Agrega los atributos directamente (si existen)
  if (element.attributes && element.attributes.length > 0) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      obj[attr.name] = attr.value;
    }
  }

  // Si el elemento tiene hijos
  if (element.childNodes && element.childNodes.length > 0) {
    // Si existe un solo nodo y es de tipo texto
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
      const text = element.childNodes[0].nodeValue.trim();
      // Si no se agregaron atributos, retornamos directamente el string
      if (Object.keys(obj).length === 0) {
        return text;
      }
      // Si hay atributos, agregamos el valor en la propiedad "value"
      obj.value = text;
    } else {
      // Procesa cada nodo hijo que sea un elemento
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        if (child.nodeType === 1) { // ELEMENT_NODE
          const tagName = child.tagName;
          const childValue = parseElementToObjectMinimal(child);
          if (obj[tagName]) {
            // Si ya existe la propiedad, asegúrate de que sea un array
            if (!Array.isArray(obj[tagName])) {
              obj[tagName] = [obj[tagName]];
            }
            obj[tagName].push(childValue);
          } else {
            obj[tagName] = childValue;
          }
        }
      }
    }
  }
  return obj;
}

module.exports = {
  jsonToXml,
  XmlToDocument,
  sanitizaXml,
  parseElementToObjectMinimal,
};
