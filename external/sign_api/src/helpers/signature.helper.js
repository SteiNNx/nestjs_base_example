const fs = require('fs');
const { DOMParser, XMLSerializer } = require('xmldom');
const { SignedXml } = require('xml-crypto');
const { config } = require('../config/config.js');

const AdapterError = require('../exceptions/adapter.exception');
const TechnicalError = require('../exceptions/technical.exception');
const LoggerHelper = require('./logger.helper');

const logger = new LoggerHelper('signature.helper.refactored');

/**
 * Elimina saltos de línea, tabulaciones y espacios innecesarios entre etiquetas de un XML en forma de string.
 * Esta función deja el XML en una sola línea, concatenando las etiquetas.
 * 
 * ⚠️ Nota: Si existen espacios significativos en el contenido de texto de los nodos, estos se verán afectados.
 * Evalúa si este comportamiento es aceptable para tu caso.
 * 
 * @param {String} xmlString - Cadena que contiene el XML.
 * @returns {String} - Cadena sanitizada sin saltos de línea, tabulaciones ni espacios extra entre etiquetas.
 */
function sanitizaXml(xmlString) {
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
function parseElementToObjectMinimal(element) {
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

/**
 * Carga las credenciales (privateKey, certificate) desde paths en config.
 * @returns {Object} { privateKey, certificate }
 * @throws {AdapterError}
 */
function loadCredentials() {
  const { privateKeyPath, certificatePath } = config;
  let privateKey = null;
  let certificate = null;
  try {
    privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
    certificate = fs.readFileSync(certificatePath, 'utf-8');
  } catch (error) {
    logger.error('[loadCredentials] Error al leer llaves/certificados: ' + error.message);
    throw new AdapterError(
      'SIGN.KEY_PEM_FILE_READ_ERROR',
      'Error al leer las llaves privadas o certificados.',
      502,
      error
    );
  }

  if (!privateKey || !privateKey.trim()) {
    logger.error('[loadCredentials] La llave privada está vacía o ilegible.');
    throw new TechnicalError(
      'SIGN.INVALID_PRIVATE_KEY_PEM_FILE',
      'La llave privada está vacía o no se pudo leer correctamente.',
      500
    );
  }
  return { privateKey, certificate };
}

/**
 * Firma un XML utilizando la llave privada y el certificado configurados.
 * @param {String} xmlString - Cadena XML base (tal cual se recibió) que se firmará.
 * @param {String} [transactionId='xml-data'] - ID para inyectar en el nodo raíz (opcional).
 * @returns {String} - XML firmado y modificado (con <Signature> y <AdditionalInfo>).
 */
function signXml(xmlString, transactionId = 'xml-data') {
  logger.info('--------- [signXml] - INIT ---------');
  const startTime = Date.now();
  logger.info(`Longitud de xmlString original: ${xmlString?.length || 0}`);

  // Sanitizar el XML antes de parsearlo
  xmlString = sanitizaXml(xmlString);

  // 1) Parsear el XML
  let dom;
  try {
    dom = new DOMParser().parseFromString(xmlString, 'application/xml');
    const parseError = dom.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error(parseError[0].textContent);
    }
  } catch (error) {
    logger.error('Error al parsear el XML: ' + error.message);
    throw new TechnicalError(
      'SIGN.XML_PARSING',
      'Error al parsear el XML proporcionado.',
      500,
      error
    );
  }

  // 2) Inyectar atributo Id al nodo raíz
  const rootNode = dom.documentElement;
  if (rootNode) {
    rootNode.setAttribute('Id', transactionId);
    logger.info(`Id="${transactionId}" asignado al nodo raíz <${rootNode.tagName}>.`);
  }

  // 3) Serializar para firmar
  const xmlToSign = new XMLSerializer().serializeToString(dom);
  logger.info(`Longitud del XML tras setear Id: ${xmlToSign.length}`);

  // 4) Cargar llaves/certificado
  const { privateKey, certificate } = loadCredentials();

  // 5) Instanciar SignedXml
  logger.info('Creando instancia de SignedXml (para firmar) ...');
  const sig = new SignedXml({
    canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    privateKey,
    publicCert: certificate,
  });

  // 6) Agregar referencia
  sig.addReference({
    xpath: `//*[@Id='${transactionId}']`,
    transforms: [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    ],
    digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
  });

  // 7) Firmar
  logger.info('Computando la firma ...');
  try {
    sig.computeSignature(xmlToSign, {
      location: {
        reference: `//*[@Id='${transactionId}']`,
        action: 'append',
      },
    });
  } catch (error) {
    logger.error('Error al computar la firma: ' + error.message);
    throw new TechnicalError(
      'SIGN.SIGNATURE_COMPUTE_ERROR',
      'Error al calcular la firma del XML.',
      500,
      error
    );
  }

  let signedXml = sig.getSignedXml();

  // 8) (Opcional) Inyectar nodos custom en <Signature>
  let signedDom;
  try {
    signedDom = new DOMParser().parseFromString(signedXml, 'application/xml');
    const parseError = signedDom.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error(parseError[0].textContent);
    }
  } catch (error) {
    logger.error('Error al parsear el XML firmado: ' + error.message);
    throw new TechnicalError(
      'SIGN.XML_PARSING_SIGNED',
      'Error al parsear el XML firmado.',
      500,
      error
    );
  }

  // 9) Agregar info extra en <Signature>
  const signatureNode = signedDom.getElementsByTagName('Signature')[0];
  if (!signatureNode) {
    throw new TechnicalError(
      'SIGN.SIGNATURE_MISSING',
      'No se encontró el nodo <Signature> en el XML firmado.',
      500
    );
  }

  const signingTime = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  signatureNode.setAttribute('signingDate', signingTime);

  const additionalInfoNode = signedDom.createElement('AdditionalInfo');
  additionalInfoNode.setAttribute('serverTimeZone', 'America/Santiago');
  additionalInfoNode.setAttribute('signedByServer', 'true');

  const signingDateValueNode = signedDom.createElement('signingDate');
  signingDateValueNode.appendChild(signedDom.createTextNode(signingTime));
  additionalInfoNode.appendChild(signingDateValueNode);

  signatureNode.appendChild(additionalInfoNode);

  signedXml = new XMLSerializer().serializeToString(signedDom);

  const endTime = Date.now() - startTime;
  logger.info(`[signXml] - END (duración=${endTime}ms)`);
  return signedXml;
}

/**
 * Valida la firma de un documento XML firmado.
 * Además de indicar si la firma es válida, se extraen detalles importantes de la
 * estructura de la firma (como SignedInfo, SignatureValue, KeyInfo y AdditionalInfo) en un objeto minimalista.
 * 
 * @param {String} signedXmlString - Cadena XML que ya contiene la firma digital.
 * @returns {Object} - Objeto con { isValid: boolean, details: Object }.
 */
function validateXmlSignature(signedXmlString) {
  logger.info('--------- [validateXmlSignature] - INIT ---------');
  const startTime = Date.now();
  logger.info(`Recibido XML de longitud: ${signedXmlString?.length || 0} caracteres.`);

  // Sanitizar el XML antes de parsear
  signedXmlString = sanitizaXml(signedXmlString);

  // 1) Parsear el XML firmado
  let signedDom;
  try {
    signedDom = new DOMParser().parseFromString(signedXmlString, 'application/xml');
    const parseError = signedDom.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error(parseError[0].textContent);
    }
  } catch (error) {
    logger.error('Error al parsear el XML firmado: ' + error.message);
    throw new TechnicalError(
      'SIGN.VALIDATE_XML_PARSING',
      'Error al parsear el XML firmado.',
      500,
      error
    );
  }

  // 2) Cargar solo el certificado (público) para verificar
  let certificate;
  try {
    const { certificatePath } = config;
    certificate = fs.readFileSync(certificatePath, 'utf-8');
    if (!certificate.trim()) {
      throw new Error('Certificado vacío');
    }
  } catch (error) {
    logger.error('Error al leer el certificado: ' + error.message);
    throw new AdapterError(
      'SIGN.CERT_PEM_FILE_READ_ERROR',
      'Error al leer el certificado público.',
      502,
      error
    );
  }

  // 3) Crear instancia de SignedXml para verificación
  logger.info('Instanciando SignedXml (para verificar) ...');
  const sig = new SignedXml({
    canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    publicCert: certificate,
  });

  // 4) Obtener <Signature> y cargarlo en sig
  const signatureNode = signedDom.getElementsByTagName('Signature')[0];
  if (!signatureNode) {
    logger.error('No se encontró <Signature> en el DOM parseado.');
    throw new TechnicalError(
      'SIGN.VALIDATE_SIGNATURE_MISSING',
      'No se encontró el nodo <Signature> en el XML firmado.',
      500
    );
  }

  const signatureString = new XMLSerializer().serializeToString(signatureNode);
  sig.loadSignature(signatureString);

  // 5) Establecer keyInfoProvider para que devuelva la clave pública (o el X.509)
  sig.keyInfoProvider = {
    getKeyInfo: () => {
      return '<X509Data></X509Data>';
    },
    getKey: () => {
      return certificate;
    },
  };

  // 6) Verificar la firma
  const docAsString = new XMLSerializer().serializeToString(signedDom);
  const isValid = sig.checkSignature(docAsString);

  if (!isValid) {
    const validationErrors = Array.isArray(sig.validationErrors) ? sig.validationErrors : [];
    logger.error(`La firma es inválida. Errores: ${validationErrors.join(', ')}`);
    const totalTime = Date.now() - startTime;
    logger.info(`Tiempo total de validación (ms): ${totalTime}`);
    return {
      isValid: false,
      details: validationErrors.length
        ? `La firma no es válida. Errores: ${validationErrors.join(', ')}`
        : 'La firma no es válida. [Sin detalles en validationErrors]',
    };
  }

  // Firma válida: se extraen los detalles del nodo <Signature> en un objeto minimalista.
  const signatureDetails = parseElementToObjectMinimal(signatureNode);

  const totalTime = Date.now() - startTime;
  logger.info(`Tiempo total de validación (ms): ${totalTime}`);

  return {
    isValid: true,
    details: {
      message: 'Firma válida y XML Fidedigno.',
      signature: signatureDetails.AdditionalInfo,
    },
  };
}

module.exports = {
  signXml,
  validateXmlSignature,
};
