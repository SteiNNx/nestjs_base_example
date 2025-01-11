// src/helpers/signature.helper.js

const fs = require('fs');
const AdapterError = require('../exceptions/adapter.exception');
const TechnicalError = require('../exceptions/technical.exception');

const { DOMParser, XMLSerializer } = require('xmldom');
const { SignedXml } = require('xml-crypto');
const { config } = require('../config/config.js');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('signature.helper');

/**
 * Firma un XML utilizando la llave privada y el certificado configurados.
 *
 * @param {String} xmlString - Cadena XML base a firmar.
 * @param {String} transactionId - ID para inyectar en <Payment Id="..."> (opcional).
 * @returns {String} - XML firmado y modificado.
 */
const signXml = (xmlString, transactionId = '_0') => {
  logger.info('--------- [signature.helper] [signXml] - INIT ---------');

  try {
    // 1. Parsear XML inicial
    logger.info('--------- [signature.helper] [signXml] - Step: Parseando el XML original ---------');
    let dom;
    try {
      dom = new DOMParser().parseFromString(xmlString, 'application/xml');
      const parseError = dom.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error(parseError[0].textContent);
      }
    } catch (error) {
      logger.error('--------- [signature.helper] [signXml] - ERROR: Fallo al parsear el XML ---------');
      throw new TechnicalError('SIGN.XML_PARSING', 'Error al parsear el XML proporcionado.', 500, error);
    }

    // Re-serializar
    const newXmlString = new XMLSerializer().serializeToString(dom);

    // 2. Preparar firma
    logger.info('--------- [signature.helper] [signXml] - Step: Cargando privateKey y certificate ---------');
    let privateKey, certificate;
    try {
      const { privateKeyPath, certificatePath } = config;
      privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
      certificate = fs.readFileSync(certificatePath, 'utf-8');
    } catch (error) {
      logger.error('--------- [signature.helper] [signXml] - ERROR: Fallo al leer las llaves o certificados ---------');
      throw new AdapterError(
        'SIGN.KEY_PEM_FILE_READ_ERROR',
        'Error al leer las llaves privadas o certificados.',
        502,
        error,
      );
    }

    if (!privateKey || !privateKey.trim()) {
      logger.error(
        '--------- [signature.helper] [signXml] - ERROR: La llave privada (privateKey) está vacía o no se pudo leer correctamente ---------',
      );
      throw new TechnicalError(
        'SIGN.INVALID_PRIVATE_KEY_PEM_FILE',
        'La llave privada está vacía o no se pudo leer correctamente.',
        500,
      );
    }

    logger.info('--------- [signature.helper] [signXml] - Step: Creando instancia de SignedXml ---------');
    const signedXmlOptions = {
      canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
      signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
      privateKey,
    };
    const sig = new SignedXml(signedXmlOptions);

    logger.info('--------- [signature.helper] [signXml] - Step: Agregando referencia (digestAlgorithm=SHA256) ---------');
    sig.addReference({
      xpath: '/*',
      transforms: [
        'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
        'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
      ],
      digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
    });

    // Incluir certificado en KeyInfo
    sig.keyInfoProvider = {
      getKeyInfo: () => {
        logger.info('--------- [signature.helper] [signXml] - Step: Generando KeyInfo con el certificado ---------');
        const cleanCert = certificate
          .replace(/-----BEGIN CERTIFICATE-----/g, '')
          .replace(/-----END CERTIFICATE-----/g, '')
          .replace(/\r?\n|\r/g, '');
        return `<X509Data><X509Certificate>${cleanCert}</X509Certificate></X509Data>`;
      },
    };

    // 3. Firmar
    logger.info('--------- [signature.helper] [signXml] - Step: Calculando la firma ---------');
    try {
      sig.computeSignature(newXmlString, { location: { reference: '/*', action: 'append' } });
      logger.info('--------- [signature.helper] [signXml] - Step: Firma calculada correctamente ---------');
    } catch (error) {
      logger.error('--------- [signature.helper] [signXml] - ERROR: Fallo al calcular la firma ---------');
      throw new TechnicalError('SIGN.SIGNATURE_COMPUTE_ERROR', 'Error al calcular la firma del XML.', 500, error);
    }

    let signedXml = sig.getSignedXml();

    // 4. (Opcional) Insertar atributos/nodos custom en <Signature>
    logger.info(
      '--------- [signature.helper] [signXml] - Step: Parseando XML firmado para inyectar etiquetas custom ---------',
    );
    let signedDom;
    try {
      signedDom = new DOMParser().parseFromString(signedXml, 'application/xml');
      const parseError = signedDom.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error(parseError[0].textContent);
      }
    } catch (error) {
      logger.error('--------- [signature.helper] [signXml] - ERROR: Fallo al parsear el XML firmado ---------');
      throw new TechnicalError('SIGN.XML_PARSING_SIGNED', 'Error al parsear el XML firmado.', 500, error);
    }

    const signatureNode = signedDom.getElementsByTagName('Signature')[0];
    if (signatureNode) {
      // Atributo con fecha/hora local (Chile)
      const signingTime = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
      signatureNode.setAttribute('signingDate', signingTime);

      // <AdditionalInfo>
      const additionalInfoNode = signedDom.createElement('AdditionalInfo');
      additionalInfoNode.setAttribute('serverTimeZone', 'America/Santiago');
      additionalInfoNode.setAttribute('signedByServer', 'true');

      const signingDateValueNode = signedDom.createElement('signingDate');
      signingDateValueNode.appendChild(signedDom.createTextNode(signingTime));
      additionalInfoNode.appendChild(signingDateValueNode);

      signatureNode.appendChild(additionalInfoNode);

      logger.info(
        '--------- [signature.helper] [signXml] - Step: Atributo "signingDate" y <AdditionalInfo> añadidos a <Signature> ---------',
      );
    } else {
      logger.warn('No se encontró <Signature> para inyectar atributos/nodos custom.');
      throw new TechnicalError('SIGN.SIGNATURE_MISSING', 'No se encontró el nodo <Signature> en el XML firmado.', 500);
    }

    // Re-serializar final
    signedXml = new XMLSerializer().serializeToString(signedDom);

    logger.info('--------- [signature.helper] [signXml] - END ---------');
    return signedXml;
  } catch (error) {
    throw error;
  }
};

/**
 * Valida la firma de un documento XML firmado, con logs detallados y manejo de errores.
 *
 * @param {String} signedXmlString - Cadena XML que ya contiene la firma digital.
 * @returns {Object} { isValid: boolean, details: string }
 */
const validateXmlSignature = (signedXmlString) => {
  logger.info('--------- [signature.helper] [validateXmlSignature] - INIT ---------');

  const startTime = Date.now();
  logger.info(`Recibido XML de longitud: ${signedXmlString?.length || 0} caracteres.`);

  try {
    // 1) Parsear el XML
    logger.info('--------- [signature.helper] [validateXmlSignature] - Step: Parseando el XML firmado ---------');
    let signedDom;
    try {
      signedDom = new DOMParser().parseFromString(signedXmlString, 'application/xml');
      const parseError = signedDom.getElementsByTagName('parsererror');

      logger.debug('Verificando si existe <parsererror> en el DOM...');
      if (parseError.length > 0) {
        const parseMsg = parseError[0].textContent || 'Error de parseo XML desconocido.';
        logger.error(`Error al parsear: ${parseMsg}`);
        throw new Error(parseMsg);
      }
      logger.info('XML parseado exitosamente, no se detectaron errores de parseo.');
    } catch (error) {
      logger.error('--------- [signature.helper] [validateXmlSignature] - ERROR: Fallo al parsear el XML firmado ---------');
      logger.error(`Mensaje de error al parsear XML: ${error.message}`);
      throw new TechnicalError(
        'SIGN.VALIDATE_XML_PARSING',
        'Error al parsear el XML firmado.',
        500,
        error
      );
    }

    // 2) Crear instancia para verificación
    logger.info('--------- [signature.helper] [validateXmlSignature] - Step: Instanciando SignedXml ---------');
    const sig = new SignedXml();
    logger.debug(`Creada instancia SignedXml con propiedades: ${JSON.stringify(Object.keys(sig))}`);

    // 3) Encontrar <Signature> y cargarlo
    logger.info('Buscando nodo <Signature> dentro del DOM...');
    const signatureNode = signedDom.getElementsByTagName('Signature')[0];
    if (!signatureNode) {
      logger.error('--------- [signature.helper] [validateXmlSignature] - ERROR: No se encontró nodo <Signature> ---------');
      throw new TechnicalError(
        'SIGN.VALIDATE_SIGNATURE_MISSING',
        'No se encontró el nodo <Signature> en el XML firmado.',
        500
      );
    }

    const signatureString = new XMLSerializer().serializeToString(signatureNode);
    logger.info(`Nodo <Signature> encontrado. Longitud del nodo serializado: ${signatureString.length} caracteres.`);
    logger.debug(`Contenido del nodo <Signature>: ${signatureString}`);

    // Cargamos la firma en SignedXml
    logger.info('Cargando la firma en SignedXml...');
    sig.loadSignature(signatureString);

    // 4) (Opcional) Extraer X509Certificate si estuviera embebido, o asignar keyInfoProvider.
    //    Para este ejemplo, se omite. 
    logger.info('Se omite extracción de X509Certificate (no se usa en este ejemplo).');

    // 5) Verificar la firma
    logger.info('--------- [signature.helper] [validateXmlSignature] - Step: Verificando firma ---------');
    const docAsString = signedDom.toString();
    logger.debug(`Serializando el DOM completo para checkSignature: longitud=${docAsString.length} caracteres.`);

    const isValid = sig.checkSignature(docAsString);
    logger.debug(`Resultado devuelto por .checkSignature: ${isValid}`);

    if (!isValid) {
      // Aseguramos que validationErrors sea un array
      const validationErrors = Array.isArray(sig.validationErrors) ? sig.validationErrors : [];
      logger.error('--------- [signature.helper] [validateXmlSignature] - ERROR: La firma es inválida ---------');
      logger.error(`Errores de validación (raw): ${JSON.stringify(sig.validationErrors)}`);
      logger.error(`Errores de validación (final): ${validationErrors.join(', ')}`);

      const totalTime = Date.now() - startTime;
      logger.info(`Tiempo total de validación (ms): ${totalTime}`);
      return {
        isValid: false,
        details: validationErrors.length
          ? `La firma no es válida. Errores: ${validationErrors.join(', ')}`
          : 'La firma no es válida. [Sin detalles en validationErrors]',
      };
    }

    // Si llegamos aquí, la firma es válida
    logger.info('--------- [signature.helper] [validateXmlSignature] - Firma válida ---------');
    const totalTime = Date.now() - startTime;
    logger.info(`Tiempo total de validación (ms): ${totalTime}`);

    return {
      isValid: true,
      details: 'Firma válida y XML integro.',
    };
  } catch (error) {
    logger.error('Ocurrió un error inesperado en validateXmlSignature.', { errorMessage: error.message });
    throw error;
  }
};


module.exports = {
  signXml,
  validateXmlSignature,
};
