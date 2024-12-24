// src/index.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const xmlbuilder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');
const { DOMParser } = require('xmldom');
const xpath = require('xpath');
const { SignedXml } = require('xml-crypto');

const app = express();
const PORT = process.env.EXTERNAL_API_SIGN_PORT || 3001;

// Cargar llaves y certificado
const privateKey = fs.readFileSync(path.resolve(process.env.EXTERNAL_API_SIGN_PRIVATE_KEY_PATH), 'utf-8');
const certificate = fs.readFileSync(path.resolve(process.env.EXTERNAL_API_SIGN_CERTIFICATE_PATH), 'utf-8');

// Middleware
app.use(bodyParser.json());

// Función para convertir JSON a XML
function jsonToXml(json) {
    const xml = xmlbuilder.create('Payment');
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            if (typeof json[key] === 'object') {
                const child = xml.ele(key);
                for (const subKey in json[key]) {
                    if (json[key].hasOwnProperty(subKey)) {
                        child.ele(subKey, json[key][subKey]);
                    }
                }
            } else {
                xml.ele(key, json[key]);
            }
        }
    }
    return xml.end({ pretty: true });
}

// Ruta para firmar los datos de pago
app.post('/sign', (req, res) => {
    const payment = req.body;

    // Validar los datos de pago
    if (!payment || typeof payment !== 'object') {
        return res.status(400).send('Datos de pago inválidos');
    }

    // Convertir JSON a XML
    const xmlString = jsonToXml(payment);

    // Parsear el XML
    const doc = new DOMParser().parseFromString(xmlString);

    // Crear una instancia de SignedXml
    const sig = new SignedXml();

    sig.addReference("/*", // Referencia al elemento raíz
        ["http://www.w3.org/2000/09/xmldsig#enveloped-signature"],
        "http://www.w3.org/2000/09/xmldsig#sha1");

    sig.signingKey = privateKey;

    // Incluir el certificado en KeyInfo
    sig.keyInfoProvider = {
        getKeyInfo: function () {
            return `<X509Data><X509Certificate>${certificate.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, '')}</X509Certificate></X509Data>`;
        }
    };

    // Calcular la firma
    sig.computeSignature(xmlString, {
        location: {
            reference: "/*",
            action: "append"
        }
    });

    const signedXml = sig.getSignedXml();

    // Retornar el XML firmado
    res.setHeader('Content-Type', 'application/xml');
    res.send(signedXml);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servicio de firma escuchando en el puerto ${PORT}`);
});
