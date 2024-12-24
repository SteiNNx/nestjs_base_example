// src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const xmlbuilder = require('xmlbuilder');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Ruta para firmar los datos de pago
app.post('/sign', (req, res) => {
    const payment = req.body;

    // Validar los datos de pago
    if (!payment || typeof payment !== 'object') {
        return res.status(400).send('Datos de pago inválidos');
    }

    // Generar XML a partir de los datos de pago
    const xml = xmlbuilder.create('Payment');

    for (const key in payment) {
        if (payment.hasOwnProperty(key)) {
            if (typeof payment[key] === 'object') {
                const child = xml.ele(key);
                for (const subKey in payment[key]) {
                    if (payment[key].hasOwnProperty(subKey)) {
                        child.ele(subKey, payment[key][subKey]);
                    }
                }
            } else {
                xml.ele(key, payment[key]);
            }
        }
    }

    const xmlString = xml.end({ pretty: true });

    // Firmar el XML usando JWT como ejemplo (puedes usar otro método)
    const secretKey = 'tu_clave_secreta'; // Debe estar en una variable de entorno
    const token = jwt.sign({ data: xmlString }, secretKey, { algorithm: 'HS256' });

    // Retornar el archivo firmado (en este caso, el token JWT)
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(token);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servicio de firma escuchando en el puerto ${PORT}`);
});
