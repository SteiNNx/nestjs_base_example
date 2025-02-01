const express = require('express');
const path = require('path');
const router = express.Router();

// Ruta para servir la vista del formulario (EJS)
// Al acceder a /static o /static/upload_file_mdr se renderiza la vista "upload_file_mdr.ejs" ubicada en "src/views"
router.get(['/', '/upload_file_mdr'], (req, res) => {
    res.render('upload_file_mdr');
});

// Ruta para servir el archivo CSS
router.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// Ruta para servir un archivo SVG (por ejemplo, icon.svg)
// Al acceder a /static/icon.svg se envía el SVG
router.get('/icon.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'icon.svg'));
});

// Puedes agregar más rutas para otros assets (imágenes, JS, etc.) aquí.

module.exports = router;
