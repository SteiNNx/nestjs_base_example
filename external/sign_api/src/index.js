// src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const { config } = require('./config/config');
const routes = require('./routes/routes');

const { port } = config;
const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());


routes(app);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
