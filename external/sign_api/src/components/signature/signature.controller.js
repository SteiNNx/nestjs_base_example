// src/components/signature/signature.controller.js
const signatureModule = require('./signature.module');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Operacion para realizar un chequeo de salud del servidor.
 * 
 * @function signXMLController
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 * @returns {Object} Respuesta con el estado 200 y un mensaje "OK".
 * 
 */
const signXMLController = async (req, res) => {

    const response = await signatureModule(req);

    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Content-Security-Policy", "script-src 'self'");

    return res.status(200).json(response);

}

module.exports = {
    signXMLController,
};
