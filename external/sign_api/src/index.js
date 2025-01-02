// src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const { port, privateKeyPath, certificatePath } = require('./config');
const { jsonToXml } = require('./xmlUtils');
const { signXml } = require('./signatureService');

const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Cargar llaves y certificado al inicio
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
const certificate = fs.readFileSync(certificatePath, 'utf-8');

/**
 * Ruta principal para firmar datos de pago.
 * Espera un JSON en el body con la información del pago.
 * Devuelve un XML firmado.
 */
app.post('/sign', (req, res) => {
  try {
    const payment = req.body;
    if (!payment || typeof payment !== 'object') {
      return res.status(400).send('Datos de pago inválidos');
    }

    // Convertir JSON a XML
    const xmlString = jsonToXml(payment);

    // Firmar el XML
    const signedXml = signXml(xmlString, privateKey, certificate);

    // Retornar el XML firmado
    res.setHeader('Content-Type', 'application/xml');
    return res.send(signedXml);
  } catch (error) {
    console.error('Error firmando XML:', error);
    return res.status(500).send('Error interno al firmar el XML');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
