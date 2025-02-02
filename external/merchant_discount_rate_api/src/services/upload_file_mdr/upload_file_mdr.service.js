// src/services/upload_file_mdr/upload_file_mdr.service.js

/**
 * Servicio para la carga y procesamiento de archivos MDR.
 * Se apoya en los helpers para lectura y parseo del archivo.
 *
 * @module uploadFileMdrService
 */

const { parseTarifaLineToItem, readDynamicFile } = require('../../helpers/file-system.helper');
const { tarifasMdrMapping } = require('../../helpers/mapping-attributes.helper');
const { handleThrownError } = require('../../providers/error-handler.provider');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('upload_file_mdr.service.js');

/**
 * Realiza la lectura y parseo del archivo MDR, transformando cada línea
 * en un objeto listo para su uso posterior (por ejemplo, insertarlo en DynamoDB).
 *
 * @async
 * @function uploadFileMdrService
 * @param {import('express').Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Promise<Object>} Resultado del procesamiento (por ejemplo, la lista de items parseados).
 * @throws {Error} Si ocurre algún problema de lectura o parseo del archivo.
 */
const uploadFileMdrService = async (req) => {
    try {
        logger.info('Iniciando procesamiento de archivo MDR');

        // Extraer el nombre del archivo desde el body (ajusta según tu necesidad real).
        const { fileName } = req.body;
        if (!fileName) {
            throw new Error('El nombre del archivo (fileName) es requerido');
        }

        // Leer el contenido del archivo
        const fileContent = readDynamicFile(fileName);
        if (!fileContent) {
            throw new Error(`No se pudo leer el archivo: ${fileName}`);
        }

        // Para que la función parseTarifaLineToItem pueda mapear, 
        // se asigna globalmente o se pasa de forma local:
        global.attributeMapping = tarifasMdrMapping;

        // Dividir el contenido por líneas
        const lines = fileContent.split('\n');

        // Procesar cada línea
        const parsedItems = lines.reduce((acc, line) => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                const item = parseTarifaLineToItem(trimmedLine);
                acc.push(item);
            }
            return acc;
        }, []);

        // Aquí podrías hacer la inserción en DynamoDB u otra operación con los items parseados
        // Ejemplo:
        // await someDynamoDbFunction(parsedItems);

        logger.info('Archivo MDR procesado correctamente');
        return { parsedItems };
    } catch (error) {
        logger.error('Error al procesar archivo MDR', { error: error.message });
        // Manejo de error genérico; utiliza tu propia clase de error si lo deseas
        handleThrownError(error, 'UPLOAD.MDR.0002', 'Error procesando archivo MDR.');
    }
};

module.exports = {
    uploadFileMdrService,
};
