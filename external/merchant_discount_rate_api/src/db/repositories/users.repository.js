// src/db/repositories/users.repository.js

/**
 * @file users.repository.js
 * Repositorio para interactuar con la tabla 'users' en DynamoDB.
 */

const ClientDynamoDb = require('../client.dynamodb');
const LoggerHelper = require('../../helpers/logger.helper');

const logger = new LoggerHelper('users.repository.js');

class UsersRepository {
    /**
     * Crea una instancia de UsersRepository.
     */
    constructor() {
        this.dynamoClient = new ClientDynamoDb();
        this.tableName = 'users';
    }

    /**
    * Obtiene un registro por su username (clave primaria).
    *
    * @async
    * @function getByUsername
    * @param {string} username - El nombre de usuario (clave primaria) que se desea obtener.
    * @returns {Promise<Object|null>} Registro encontrado o `null` si no existe.
    * @example
    * const usuario = await usersRepository.getByUsername('admin');
    */
    async getByUsername(username) {
        try {
            const params = {
                TableName: this.tableName,
                Key: { username: { S: username } }
            };
            const result = await this.dynamoClient.getItem(params);
            return Object.keys(result).length > 0 ? result : null;
        } catch (error) {
            logger.error(`Error en getByUsername: ${error.message}`, error);
            throw error;
        }
    }

    /**
     * Obtiene un registro por su ID (Partition Key).
     *
     * @async
     * @function getById
     * @param {string} id - ID que se desea obtener.
     * @returns {Promise<Object|null>} Registro encontrado o `null` si no existe.
     * @example
     * const registro = await usersRepository.getById('user-123');
     */
    async getById(id) {
        try {
            const params = {
                TableName: this.tableName,
                Key: { id: { S: id } }
            };
            const result = await this.dynamoClient.getItem(params);
            return Object.keys(result).length > 0 ? result : null;
        } catch (error) {
            logger.error(`Error en getById: ${error.message}`, error);
            throw error;
        }
    }

    /**
     * Añade un nuevo registro a la tabla 'users'.
     *
     * @async
     * @function add
     * @param {Object} record - Objeto que representa el nuevo registro (formateado para DynamoDB, por ejemplo utilizando marshall).
     * @returns {Promise<Object>} Resultado de la inserción.
     * @example
     * const registro = { id: { S: 'user-123' }, name: { S: 'Juan' }, age: { N: '30' } };
     * const result = await usersRepository.add(registro);
     */
    async add(record) {
        try {
            const params = {
                TableName: this.tableName,
                Item: record
            };
            return await this.dynamoClient.addItem(params);
        } catch (error) {
            logger.error(`Error en add: ${error.message}`, error);
            throw error;
        }
    }

    /**
     * Actualiza un campo de un registro existente en la tabla 'users'.
     *
     * @async
     * @function update
     * @param {string} id - ID del registro a actualizar.
     * @param {string} field - Nombre del campo que se desea actualizar.
     * @param {any} newValue - Nuevo valor para el campo.
     * @returns {Promise<Object>} Resultado de la actualización.
     * @example
     * await usersRepository.update('user-123', 'name', 'Carlos');
     */
    async update(id, field, newValue) {
        try {
            const params = {
                TableName: this.tableName,
                Key: { id: { S: id } },
                UpdateExpression: 'SET #field = :value',
                ExpressionAttributeNames: { '#field': field },
                ExpressionAttributeValues: {
                    ':value': typeof newValue === 'number' ? { N: newValue.toString() } : { S: newValue }
                }
            };
            return await this.dynamoClient.updateItem(params);
        } catch (error) {
            logger.error(`Error en update: ${error.message}`, error);
            throw error;
        }
    }

    /**
     * Elimina un registro de la tabla 'users' por su ID.
     *
     * @async
     * @function delete
     * @param {string} id - ID del registro a eliminar.
     * @returns {Promise<Object>} Resultado de la eliminación.
     * @example
     * await usersRepository.delete('user-123');
     */
    async delete(id) {
        try {
            const params = {
                TableName: this.tableName,
                Key: { id: { S: id } }
            };
            return await this.dynamoClient.deleteItem(params);
        } catch (error) {
            logger.error(`Error en delete: ${error.message}`, error);
            throw error;
        }
    }

    /**
     * Escanea todos los registros de la tabla 'users'.
     *
     * @async
     * @function scan
     * @returns {Promise<Array<Object>>} Lista de registros o `[]` si no hay registros.
     * @example
     * const registros = await usersRepository.scan();
     */
    async scan() {
        try {
            const params = { TableName: this.tableName };
            return await this.dynamoClient.scanTable(params);
        } catch (error) {
            logger.error(`Error en scan: ${error.message}`, error);
            throw error;
        }
    }
}

module.exports = UsersRepository;
