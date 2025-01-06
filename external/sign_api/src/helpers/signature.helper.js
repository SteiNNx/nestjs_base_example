// src/helpers/signature.helper.js

/**
 * Helper para la firma de documentos XML.
 *
 * @module signatureHelper
 */

const fs = require('fs');
const xpath = require('xpath');
const { SignedXml } = require('xml-crypto');
const { config } = require('../config/config.js');

/**
 * Reemplaza `LoggerHelper` por tu nuevo logger, si lo renombraste.
 * Si mantienes el mismo, así estaría bien.
 */
const LoggerHelper = require('./logger.helper');

const logger = new LoggerHelper('signature.helper');

/**
 * Firma un XML utilizando la llave privada y el certificado configurados.
 *
 * @param {String} xmlString - Cadena XML a firmar.
 * @returns {String} - XML firmado.
 * @throws {Error} - Si la llave privada no está disponible o es inválida.
 */
const signXml = (xmlString) => {
  logger.info('--------- [signature.helper] [signXml] - INIT ---------');

  const { privateKeyPath, certificatePath } = config;

  // Cargar llaves y certificado
  logger.info('--------- [signature.helper] [signXml] - Step: Cargando privateKey y certificate ---------');
  const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
  const certificate = fs.readFileSync(certificatePath, 'utf-8');

  // Validar la llave privada
  if (!privateKey || !privateKey.trim()) {
    logger.error('--------- [signature.helper] [signXml] - ERROR: La llave privada (privateKey) está vacía o no se pudo leer correctamente ---------');
    throw new Error('La llave privada (privateKey) está vacía o no se pudo leer correctamente.');
  }

  // Crear objeto de configuración para SignedXml
  const signedXmlOptions = {
    canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    privateKey,
  };

  logger.info('--------- [signature.helper] [signXml] - Step: Creando instancia de SignedXml ---------');
  const sig = new SignedXml(signedXmlOptions);

  // Agregar referencia
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

  // Calcular la firma
  logger.info('--------- [signature.helper] [signXml] - Step: Calculando la firma ---------');
  sig.computeSignature(xmlString, { location: { reference: '/*', action: 'append' } });

  logger.info('--------- [signature.helper] [signXml] - Step: Firma calculada correctamente ---------');

  // Obtener el XML firmado
  const signedXml = sig.getSignedXml();

  logger.info('--------- [signature.helper] [signXml] - END ---------');
  return signedXml;
};

module.exports = {
  signXml,
};
