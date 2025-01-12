// src/helpers/signature.helper.js

const { DOMParser, XMLSerializer } = require('xmldom');
const { SignedXml } = require('xml-crypto');
const { loadCredentials, getSignConfig } = require('../providers/credentials.provider.js');
const TechnicalError = require('../exceptions/technical.exception');
const { parseElementToObjectMinimal } = require('./xml.helper.js');
const LoggerHelper = require('./logger.helper');

const logger = new LoggerHelper('signature.helper');

/**
 * Firma un XML utilizando la llave privada y el certificado configurados.
 *
 * @function signXml
 * @param {String} xmlString - Cadena XML base que se firmará.
 * @param {String} [tagNameAssignedAfterSignedXmlElementParent='xml-data'] - ID que se inyectará en el nodo raíz (opcional).
 * @returns {String} XML firmado y modificado, incluyendo el nodo <Signature> y <AdditionalInfo>.
 * @throws {TechnicalError} Cuando ocurre un error en el parseo o al computar la firma.
 */
function signXml(xmlString, tagNameAssignedAfterSignedXmlElementParent = 'xml-data') {
  logger.info('[signXml] - INIT');
  const startTime = Date.now();
  logger.info(`[signXml] Longitud del xmlString original: ${xmlString?.length || 0}`);

  // ============================================================================
  // 1) Parseo del XML
  // ============================================================================
  let dom;
  try {
    dom = new DOMParser().parseFromString(xmlString, 'application/xml');
    const parseError = dom.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error(parseError[0].textContent);
    }
    logger.info('[signXml] XML parseado exitosamente');
  } catch (error) {
    logger.error('[signXml] Error al parsear el XML:', { error: error.message });
    throw new TechnicalError('SIGN.XML_PARSING', 'Error al parsear el XML proporcionado.', 500, error);
  }

  // ============================================================================
  // 2) Inyección del atributo Id en el nodo raíz
  // ============================================================================
  const rootNode = dom.documentElement;
  if (rootNode) {
    rootNode.setAttribute('Id', tagNameAssignedAfterSignedXmlElementParent);
    logger.info(`[signXml] Atributo Id="${tagNameAssignedAfterSignedXmlElementParent}" asignado al nodo raíz <${rootNode.tagName}>.`);
  }

  // ============================================================================
  // 3) Serialización del XML para la firma
  // ============================================================================
  const xmlToSign = new XMLSerializer().serializeToString(dom);
  logger.info(`[signXml] Longitud del XML tras asignar Id: ${xmlToSign.length}`);

  // ============================================================================
  // 4) Carga de credenciales y configuración de firma
  // ============================================================================
  const { privateKey, certificate } = loadCredentials();
  const {
    canonicalizationAlgorithm,
    signatureAlgorithm,
    referenceTransformsFirst,
    referenceDigestAlgorithm
  } = getSignConfig();

  // ============================================================================
  // 5) Instanciación de SignedXml y configuración
  // ============================================================================
  logger.info('[signXml] Creando instancia de SignedXml (para firmar)...');
  const sig = new SignedXml({
    canonicalizationAlgorithm: canonicalizationAlgorithm,
    signatureAlgorithm: signatureAlgorithm,
    privateKey,
    publicCert: certificate,
  });

  // ============================================================================
  // 6) Agregar referencia para la firma
  // ============================================================================
  sig.addReference({
    xpath: `//*[@Id='${tagNameAssignedAfterSignedXmlElementParent}']`,
    transforms: [
      referenceTransformsFirst,
      canonicalizationAlgorithm,
    ],
    digestAlgorithm: referenceDigestAlgorithm,
  });

  // ============================================================================
  // 7) Computación de la firma
  // ============================================================================
  logger.info('[signXml] Computando la firma...');
  try {
    sig.computeSignature(xmlToSign, {
      location: {
        reference: `//*[@Id='${tagNameAssignedAfterSignedXmlElementParent}']`,
        action: 'append',
      },
    });
  } catch (error) {
    logger.error('[signXml] Error al computar la firma:', { error: error.message });
    throw new TechnicalError('SIGN.SIGNATURE_COMPUTE_ERROR', 'Error al calcular la firma del XML.', 500, error);
  }

  let signedXml = sig.getSignedXml();

  // ============================================================================
  // 8) Parseo del XML firmado para inyectar información adicional
  // ============================================================================
  let signedDom;
  try {
    signedDom = new DOMParser().parseFromString(signedXml, 'application/xml');
    const parseError = signedDom.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error(parseError[0].textContent);
    }
    logger.info('[signXml] XML firmado parseado exitosamente');
  } catch (error) {
    logger.error('[signXml] Error al parsear el XML firmado:', { error: error.message });
    throw new TechnicalError('SIGN.XML_PARSING_SIGNED', 'Error al parsear el XML firmado.', 500, error);
  }

  // ============================================================================
  // 9) Inyección de información adicional en el nodo <Signature>
  // ============================================================================
  const signatureNode = signedDom.getElementsByTagName('Signature')[0];
  if (!signatureNode) {
    throw new TechnicalError('SIGN.SIGNATURE_MISSING', 'No se encontró el nodo <Signature> en el XML firmado.', 500);
  }

  const signingTime = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  signatureNode.setAttribute('signingDate', signingTime);
  logger.info(`[signXml] Atributo signingDate agregado con valor: ${signingTime}`);

  const additionalInfoNode = signedDom.createElement('AdditionalInfo');
  additionalInfoNode.setAttribute('serverTimeZone', 'America/Santiago');
  additionalInfoNode.setAttribute('signedByServer', 'true');

  const signingDateValueNode = signedDom.createElement('signingDate');
  signingDateValueNode.appendChild(signedDom.createTextNode(signingTime));
  additionalInfoNode.appendChild(signingDateValueNode);
  signatureNode.appendChild(additionalInfoNode);
  logger.info('[signXml] Nodo <AdditionalInfo> inyectado en <Signature>');

  // ============================================================================
  // 10) Serialización final del XML firmado
  // ============================================================================
  signedXml = new XMLSerializer().serializeToString(signedDom);
  const endTime = Date.now() - startTime;
  logger.info(`[signXml] - END (duración=${endTime}ms)`);
  return signedXml;
}

/**
 * Valida la firma de un documento XML firmado, extrayendo detalles minimalistas.
 *
 * @function validateXmlSignature
 * @param {String} signedXmlString - Cadena XML que contiene la firma digital.
 * @returns {Object} Objeto con la validación de la firma: { isValid: boolean, details: Object | String }.
 * @throws {TechnicalError} Cuando ocurre un error en el parseo o la validación.
 */
function validateXmlSignature(signedXmlString) {
  logger.info('[validateXmlSignature] - INIT');
  const startTime = Date.now();
  logger.info(`[validateXmlSignature] Recibido XML de longitud: ${signedXmlString?.length || 0} caracteres.`);

  // ============================================================================
  // 1) Parseo del XML firmado
  // ============================================================================
  let signedDom;
  try {
    signedDom = new DOMParser().parseFromString(signedXmlString, 'application/xml');
    const parseError = signedDom.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error(parseError[0].textContent);
    }
    logger.info('[validateXmlSignature] XML firmado parseado exitosamente');
  } catch (error) {
    logger.error('[validateXmlSignature] Error al parsear el XML firmado:', { error: error.message });
    throw new TechnicalError('SIGN.VALIDATE_XML_PARSING', 'Error al parsear el XML firmado.', 500, error);
  }

  // ============================================================================
  // 2) Carga de certificado y configuración para la verificación
  // ============================================================================
  const { certificate } = loadCredentials();
  const { canonicalizationAlgorithm, signatureAlgorithm } = getSignConfig();

  // ============================================================================
  // 3) Instanciación de SignedXml para verificación
  // ============================================================================
  logger.info('[validateXmlSignature] Instanciando SignedXml para verificación...');
  const sig = new SignedXml({
    canonicalizationAlgorithm: canonicalizationAlgorithm,
    signatureAlgorithm: signatureAlgorithm,
    publicCert: certificate,
  });

  // ============================================================================
  // 4) Carga del nodo <Signature> en la instancia de SignedXml
  // ============================================================================
  const signatureNode = signedDom.getElementsByTagName('Signature')[0];
  if (!signatureNode) {
    logger.error('[validateXmlSignature] No se encontró <Signature> en el DOM parseado.');
    throw new TechnicalError('SIGN.VALIDATE_SIGNATURE_MISSING', 'No se encontró el nodo <Signature> en el XML firmado.', 500);
  }
  const signatureString = new XMLSerializer().serializeToString(signatureNode);
  sig.loadSignature(signatureString);

  // ============================================================================
  // 5) Configuración del keyInfoProvider para la verificación
  // ============================================================================
  sig.keyInfoProvider = {
    getKeyInfo: () => '<X509Data></X509Data>',
    getKey: () => certificate,
  };

  // ============================================================================
  // 6) Verificación de la firma
  // ============================================================================
  const docAsString = new XMLSerializer().serializeToString(signedDom);
  const isValid = sig.checkSignature(docAsString);
  logger.info(`[validateXmlSignature] Resultado de verificación: ${isValid}`);

  if (!isValid) {
    const validationErrors = Array.isArray(sig.validationErrors) ? sig.validationErrors : [];
    logger.error('[validateXmlSignature] Firma inválida.', { errors: validationErrors.join(', ') });
    const totalTime = Date.now() - startTime;
    logger.info(`[validateXmlSignature] Tiempo total de validación (ms): ${totalTime}`);
    return {
      isValid: false,
      details: validationErrors.length
        ? `La firma no es válida. Errores: ${validationErrors.join(', ')}`
        : 'La firma no es válida. [Sin detalles en validationErrors]',
    };
  }

  // ============================================================================
  // 7) Extracción de detalles minimalistas del nodo <Signature>
  // ============================================================================
  const signatureDetails = parseElementToObjectMinimal(signatureNode);
  const totalTime = Date.now() - startTime;
  logger.info(`[validateXmlSignature] Tiempo total de validación (ms): ${totalTime}`);

  return {
    isValid: true,
    details: {
      message: 'Firma válida y XML fidedigno.',
      signature: signatureDetails.AdditionalInfo,
    },
  };
}

module.exports = {
  signXml,
  validateXmlSignature,
};
