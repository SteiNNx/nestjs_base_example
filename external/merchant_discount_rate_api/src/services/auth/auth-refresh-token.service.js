// src/services/auth/auth-refresh-token.service.js

/**
 * @file auth-refresh-token.service.js
 * @description Servicio para refrescar un token JWT.
 */

const UsersRepository = require('../../db/repositories/users.repository');
const { authValidateTokenService } = require('./auth-validate-token.service');
const { generateToken } = require('../../helpers/jsonwebtoken.helper');
const { handleThrownError } = require('../../providers/error-handler.provider');
const LoggerHelper = require('../../helpers/logger.helper');
const AuthError = require('../../exceptions/auth.exception');

/**
 *  Servicio de refresco de token (refresh).
 *  1) Valida token entrante.
 *  2) Genera un token nuevo.
 *  3) Almacena el token nuevo en la base de datos.
 * 
 * @module refreshTokenService
 */
const logger = new LoggerHelper('auth-refresh-token.service.js');

/**
 * Refresca un token JWT válido y regresa uno nuevo.
 * 
 * @async
 * @function refreshTokenService
 * @param {string} oldToken - Token actual que se quiere refrescar.
 * @returns {Promise<string>} El nuevo token JWT firmado.
 * @throws {AuthError} Si el token no es válido o no coincide con el almacenado.
 */
const refreshTokenService = async (oldToken) => {
    try {
        logger.info('1) Iniciando proceso de refresco de token');

        // (1) Validar el token entrante
        const decoded = await authValidateTokenService(oldToken);
        if (!decoded || !decoded.username) {
            throw new AuthError(
                'AUTH.REFRESH.INVALID_PAYLOAD',
                'El token provisto no contiene la información necesaria para refrescar.',
                400
            );
        }

        // (2) Verificar que el token coincida con el almacenado en BD
        const usersRepository = new UsersRepository();
        const user = await usersRepository.getByUsername(decoded.username);

        if (!user) {
            throw new AuthError(
                'AUTH.REFRESH.USER_NOT_FOUND',
                'Usuario no encontrado para refrescar token.',
                404
            );
        }

        if (user.token !== oldToken) {
            throw new AuthError(
                'AUTH.REFRESH.TOKEN_MISMATCH',
                'El token no coincide con el almacenado en la BD.',
                401
            );
        }

        // (3) Generar un nuevo token (mismo payload o ajustado)
        const payload = {
            username: decoded.username,
            role: decoded.role || 'user',
            userId: decoded.userId || 0,
        };
        const newToken = generateToken(payload);
        logger.info('   - Nuevo token generado correctamente');

        // (4) Guardar el nuevo token en BD usando el método "update" genérico
        logger.info('2) Guardando el nuevo token en la BD');
        await usersRepository.update(decoded.username, 'token', newToken);
        logger.info('   - Nuevo token guardado en la BD');

        // (5) Retornar el nuevo token
        return newToken;
    } catch (error) {
        logger.error('Error al refrescar el token', { error: error.message });
        handleThrownError(error, 'AUTH.REFRESH.0001', 'Error al refrescar el token JWT.');
    }
};

module.exports = { refreshTokenService };
