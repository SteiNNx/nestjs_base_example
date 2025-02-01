// src/components/upload_file_mdr/upload_file_mdr.controller.js

/**
 * Módulo para la carga de archivos MDR.
 * Contiene la lógica de orquestación que conecta el controlador con el servicio.
 *
 * @module uploadFileMdrController
 */

const { uploadFileMdrModule } = require('./upload_file_mdr.module');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('upload_file_mdr.module.js');

/**
 * Orquesta la carga y procesamiento de un archivo MDR.
 *
 * @async
 * @function uploadFileMdrController
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<Object>} Objeto con la información resultante del proceso.
 * @throws {Error} Si ocurre algún problema en la capa de servicio.
 */
const uploadFileMdrController = async (req) => {
  logger.info('Inicio de módulo de carga de archivo MDR');

  // Invocamos el servicio que hará el trabajo pesado
  const result = await uploadFileMdrModule(req);

  logger.info('Finalización de módulo de carga de archivo MDR');
  return result;
};

module.exports = {
  uploadFileMdrController,
};
