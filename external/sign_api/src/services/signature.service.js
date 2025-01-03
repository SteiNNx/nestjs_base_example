// src/services/signature.service.js
const fs = require('fs');
const { DOMParser } = require('xmldom');
const { SignedXml } = require('xml-crypto');
const xpath = require('xpath');
const { privateKeyPath, certificatePath } = require('../config/config');
const LoggerHelper = require('../helpers/logger.helper');

const logger = new LoggerHelper('SignatureService');

let privateKey;
let certificate;

// Cargamos la llave privada y el certificado una sola vez al importar el servicio
try {
  privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
  certificate = fs.readFileSync(certificatePath, 'utf-8');
  logger.info('Llave privada y certificado cargados exitosamente.');
} catch (error) {
  logger.error('Error al cargar llave privada o certificado', error);
  throw error;
}

/**
 * Firma el XML usando un certificado y una llave privada.
 * @param {String} xmlString - Cadena XML a firmar.
 * @returns {String} - XML firmado.
 */
function signXml(xmlString) {
  logger.info('Iniciando firma del XML');

  // Validar la llave privada
  if (!privateKey || !privateKey.trim()) {
    throw new Error('La llave privada está vacía o no se pudo leer correctamente.');
  }

  // Parsear el XML
  const doc = new DOMParser().parseFromString(xmlString);
  if (!doc) {
    throw new Error('No se pudo parsear el XML de entrada.');
  }

  // Configuración para SignedXml
  const signedXmlOptions = {
    canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    privateKey,
  };

  // Crear instancia de SignedXml
  const sig = new SignedXml(signedXmlOptions);

  // Agregar referencia
  sig.addReference({
    xpath: '/*',
    transforms: [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    ],
    digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
  });

  // Incluir el certificado en KeyInfo
  sig.keyInfoProvider = {
    getKeyInfo: () => {
      const cleanCert = certificate
        .replace(/-----BEGIN CERTIFICATE-----/g, '')
        .replace(/-----END CERTIFICATE-----/g, '')
        .replace(/\r?\n|\r/g, '');
      return `<X509Data><X509Certificate>${cleanCert}</X509Certificate></X509Data>`;
    },
  };

  // Calcular la firma y ubicarla al final del documento (append)
  sig.computeSignature(xmlString, {
    location: { reference: '/*', action: 'append' },
  });

  const signedXml = sig.getSignedXml();
  logger.info('XML firmado exitosamente.');
  return signedXml;
}

module.exports = {
  signXml,
};
