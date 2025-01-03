// src/signatureService.js
const fs = require('fs');
const { DOMParser } = require('xmldom');
const { SignedXml } = require('xml-crypto');
const xpath = require('xpath');

/**
 * Firma el XML usando un certificado y una llave privada.
 * @param {String} xmlString - Cadena XML a firmar.
 * @param {String} privateKey - Contenido de la llave privada.
 * @param {String} certificate - Contenido del certificado público.
 * @returns {String} - XML firmado.
 */
function signXml(xmlString, privateKey, certificate) {
    console.log("===== Iniciando firma del XML =====");
    console.log("[signXml] XML de entrada:\n", xmlString);

    // Validar la llave privada
    console.log("[signXml] Longitud de privateKey:", privateKey?.length || 0);
    if (!privateKey || !privateKey.trim()) {
        throw new Error('La llave privada (privateKey) está vacía o no se pudo leer correctamente.');
    }

    // Parsear el XML
    const doc = new DOMParser().parseFromString(xmlString);
    console.log("[signXml] XML parseado con DOMParser.");

    // Crear un objeto de configuración para SignedXml
    const signedXmlOptions = {
        canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
        signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
        privateKey: privateKey, // Asignar la llave privada aquí
    };

    // Crear una instancia de SignedXml
    const sig = new SignedXml(signedXmlOptions);
    console.log("[signXml] Instancia de SignedXml creada.");

    // Agregar referencias:
    sig.addReference({
        xpath: '/*',
        transforms: [
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
        ],
        digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
    });
    console.log("[signXml] Referencia añadida con digestAlgorithm = SHA256.");



    // Incluir el certificado en KeyInfo
    sig.keyInfoProvider = {
        getKeyInfo: () => {
            console.log("[signXml] Generando KeyInfo con el certificado...");
            const cleanCert = certificate
                .replace(/-----BEGIN CERTIFICATE-----/g, '')
                .replace(/-----END CERTIFICATE-----/g, '')
                .replace(/\r?\n|\r/g, '');
            return `<X509Data><X509Certificate>${cleanCert}</X509Certificate></X509Data>`;
        },
    };
    console.log("[signXml] keyInfoProvider establecido.");

    // Calcular la firma y ubicarla al final del documento
    console.log("[signXml] Calculando la firma...");
    sig.computeSignature(xmlString, {
        location: { reference: '/*', action: 'append' },
    });
    console.log("[signXml] Firma calculada.");

    // Obtener XML firmado
    const signedXml = sig.getSignedXml();
    console.log("[signXml] XML firmado obtenido:\n", signedXml);
    console.log("===== Fin de la firma del XML =====");

    return signedXml;
}

module.exports = {
    signXml,
};
