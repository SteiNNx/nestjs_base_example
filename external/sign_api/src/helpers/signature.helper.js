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
 * Helper para la firma y manipulación de documentos XML.
 *
 * @module signatureHelper
 */

/**
 * Firma un XML utilizando la llave privada y el certificado configurados,
 * reemplazando el atributo Id en <Payment> y añadiendo etiquetas/atributos custom
 * dentro de la firma.
 *
 * @param {String} xmlString - Cadena XML base a firmar.
 * @param {String} transactionId - (Ejemplo) ID de la transacción para inyectar en <Payment Id="...">.
 * @returns {String} - XML firmado y modificado.
 * @throws {AdapterError} Si ocurre un error al leer las llaves o certificados.
 * @throws {TechnicalError} Si ocurre un error durante la conversión o firma del XML.
 *
 */
const signXml = (xmlString, transactionId = '_0') => {
  logger.info('--------- [signature.helper] [signXml] - INIT ---------');

  try {
    /***********************************************************************
     * 1. PARSEAR XML INICIAL
     ***********************************************************************/
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

    // Re-serializamos el XML para firmarlo
    const newXmlString = new XMLSerializer().serializeToString(dom);

    /***********************************************************************
     * 2. PREPARAR FIRMA (LLAVES, CERTIFICADO) E INSTANCIAR SignedXml
     ***********************************************************************/
    logger.info('--------- [signature.helper] [signXml] - Step: Cargando privateKey y certificate ---------');
    let privateKey, certificate;
    try {
      const { privateKeyPath, certificatePath } = config;
      privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
      certificate = fs.readFileSync(certificatePath, 'utf-8');
    } catch (error) {
      logger.error('--------- [signature.helper] [signXml] - ERROR: Fallo al leer las llaves o certificados ---------');
      throw new AdapterError('SIGN.KEY_PEM_FILE_READ_ERROR', 'Error al leer las llaves privadas o certificados.', 502, error);
    }

    if (!privateKey || !privateKey.trim()) {
      logger.error(
        '--------- [signature.helper] [signXml] - ERROR: La llave privada (privateKey) está vacía o no se pudo leer correctamente ---------'
      );
      throw new TechnicalError('SIGN.INVALID_PRIVATE_KEY_PEM_FILE', 'La llave privada está vacía o no se pudo leer correctamente.', 500);
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
      xpath: '/*',  // Firmar todo el documento root
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

    /***********************************************************************
     * 3. FIRMAR EL XML
     ***********************************************************************/
    logger.info('--------- [signature.helper] [signXml] - Step: Calculando la firma ---------');
    try {
      sig.computeSignature(newXmlString, { location: { reference: '/*', action: 'append' } });
      logger.info('--------- [signature.helper] [signXml] - Step: Firma calculada correctamente ---------');
    } catch (error) {
      logger.error('--------- [signature.helper] [signXml] - ERROR: Fallo al calcular la firma ---------');
      throw new TechnicalError('SIGN.SIGNATURE_COMPUTE_ERROR', 'Error al calcular la firma del XML.', 500, error);
    }

    // Obtenemos el XML firmado (string)
    let signedXml = sig.getSignedXml();

    /***********************************************************************
     * 4. (OPCIONAL) PARSEAR DE NUEVO PARA AGREGAR ATRIBUTOS O NODOS CUSTOM
     *    dentro de la sección <Signature> generada por xml-crypto
     ***********************************************************************/
    logger.info('--------- [signature.helper] [signXml] - Step: Parseando XML firmado para inyectar etiquetas custom ---------');
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

    // Encontrar el nodo <Signature> (por default, xml-crypto genera uno con xmlns="http://www.w3.org/2000/09/xmldsig#")
    const signatureNode = signedDom.getElementsByTagName('Signature')[0];
    if (signatureNode) {
      // Agregar un atributo con la fecha/hora actual en formato local (Chile)
      const signingTime = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
      signatureNode.setAttribute('signingDate', signingTime);

      // Ejemplo: crear un nodo <AdditionalInfo> con datos custom
      const additionalInfoNode = signedDom.createElement('AdditionalInfo');
      additionalInfoNode.setAttribute('serverTimeZone', 'America/Santiago');
      additionalInfoNode.setAttribute('signedByServer', 'true');

      // Podrías añadir más nodos hijos a <AdditionalInfo> si gustas
      const signingDateValueNode = signedDom.createElement('signingDate');
      signingDateValueNode.appendChild(signedDom.createTextNode(signingTime));
      additionalInfoNode.appendChild(signingDateValueNode);

      // Insertamos <AdditionalInfo> dentro de <Signature>
      signatureNode.appendChild(additionalInfoNode);

      logger.info('--------- [signature.helper] [signXml] - Step: Atributo "signingDate" y <AdditionalInfo> añadidos a <Signature> ---------');
    } else {
      logger.warn('No se encontró <Signature> para inyectar atributos/nodos custom.');
      throw new TechnicalError('SIGN.SIGNATURE_MISSING', 'No se encontró el nodo <Signature> en el XML firmado.', 500);
    }

    // Volvemos a serializar para obtener el XML final
    signedXml = new XMLSerializer().serializeToString(signedDom);

    logger.info('--------- [signature.helper] [signXml] - END ---------');
    return signedXml;
  } catch (error) {
    // Re-lanzar el error para que sea manejado por el llamador
    throw error;
  }
};

module.exports = {
  signXml,
};
