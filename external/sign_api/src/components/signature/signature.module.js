// src/components/signature/signature.module.js
/**
 * @typedef {import('express').Request} Request
 */

const signXMLService = require('../../services/signature.service');

/**
 * Operacion para realizar un chequeo de salud del servidor.
 * 
 * @function signXMLModule
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @returns {Object} Respuesta con el estado 200 y un mensaje "OK".
 * 
 */
const signXMLModule = async (req) => {
    try {
        const response = signXMLService(req.body);
        return response;
    } catch (error) {

    }
}

module.exports = signXMLModule;