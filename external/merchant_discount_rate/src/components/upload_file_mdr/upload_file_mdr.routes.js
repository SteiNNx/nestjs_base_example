// src/components/upload_file_mdr/upload_file_mdr.route.js
/**
 * Rutas relacionadas con la carga de archivos MDR.
 *
 * @module uploadFileMdrRoute
 */

const LoggerHelper = require('../../helpers/logger.helper');
const { uploadFileMdrController } = require('./upload_file_mdr.controller');

const logger = new LoggerHelper('upload_file_mdr.route.js');

/**
 * Configura las rutas de carga de archivos MDR en la aplicación.
 *
 * @function uploadFileMdrRoute
 * @param {import('express').Application} app - Instancia de la aplicación Express.
 * @param {string} prefixApi - Prefijo para las rutas de la API.
 */
const uploadFileMdrRoute = (app, prefixApi) => {
    // Definimos la ruta para la carga del archivo MDR
    const route = `${prefixApi}/mdr/upload`;
    logger.info(`Registrando ruta: [POST] ${route}`);

    // POST /api/mdr/upload
    app.post(route, uploadFileMdrController);
};

module.exports = uploadFileMdrRoute;
