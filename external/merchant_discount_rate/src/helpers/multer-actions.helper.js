// src/helpers/multer-actions.helper.js

const multer = require('multer');
const path = require('path');

/**
 * Crea una configuración personalizada de multer.diskStorage()
 * @param {String} destination Directorio donde se almacenarán los archivos
 * @returns {multer.StorageEngine} Objeto de configuración de Multer
 */
function createMulterStorage(destination = 'uploads/') {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            // Directorio destino
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            // Mantiene el nombre original del archivo
            cb(null, file.originalname);
        }
    });
}

/**
 * Retorna un middleware de Multer para subir un archivo único
 * @param {String} fieldName Nombre del campo en el form-data (por defecto: 'file')
 * @param {String} destination Directorio donde se guardarán los archivos
 * @returns {Function} Middleware de Multer para handlear un solo archivo
 */
function singleFileUploader(fieldName = 'file', destination = 'uploads/') {
    const storage = createMulterStorage(destination);
    const upload = multer({ storage });
    return upload.single(fieldName);
}

/**
 * Retorna un middleware de Multer para subir múltiples archivos (si se requiriera)
 * @param {String} fieldName Nombre del campo en el form-data
 * @param {Number} maxCount Cantidad máxima de archivos permitidos
 * @param {String} destination Directorio donde se guardarán los archivos
 * @returns {Function} Middleware de Multer para handlear múltiples archivos
 */
function multipleFilesUploader(fieldName = 'files', maxCount = 5, destination = 'uploads/') {
    const storage = createMulterStorage(destination);
    const upload = multer({ storage });
    return upload.array(fieldName, maxCount);
}

// Exporta las funciones que necesites en el proyecto
module.exports = {
    singleFileUploader,
    multipleFilesUploader
};
