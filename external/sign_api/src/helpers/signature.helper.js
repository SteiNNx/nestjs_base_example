// src/helpers/signature.helper.js

const { DOMParser, XMLSerializer } = require('xmldom');
const { SignedXml } = require('xml-crypto');
const { loadCredentials } = require('../providers/credentials.provider.js');

const TechnicalError = require('../exceptions/technical.exception');

const { sanitizaXml, parseElementToObjectMinimal } = require('./xml.helper.js');
const LoggerHelper = require('./logger.helper');

const logger = new LoggerHelper('signature.helper');


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
  const { certificate } = loadCredentials();

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
