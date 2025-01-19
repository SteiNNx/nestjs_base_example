// src/db/repositories/mdr_discover.repository.js

/**
 * @file mdr_discover.repository.js
 * Repositorio para interactuar con la tabla 'mdr_discover' en DynamoDB.
 */

const ClientDynamoDb = require('../../db/client-dynamo.db.js');
const LoggerHelper = require('../../helpers/logger.helper');

const logger = new LoggerHelper('mdr_discover.repository.js');

class MdrDiscoverRepository {
  /**
   * Crea una instancia de MdrDiscoverRepository.
   */
  constructor() {
    this.dynamoClient = new ClientDynamoDb();
    this.tableName = 'mdr_discover';
  }

  /**
   * Obtiene un registro por su MCC (Partition Key).
   *
   * @async
   * @function getByMcc
   * @param {string} mcc - MCC que se desea obtener.
   * @returns {Promise<Object|null>} El registro encontrado o `null` si no existe.
   * @example
   * const registro = await mdrDiscoverRepository.getByMcc('1234');
   */
  async getByMcc(mcc) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { mcc: { S: mcc } }
      };
      const result = await this.dynamoClient.getItem(params);
      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      logger.error(`Error en MdrDiscoverRepository.getByMcc: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Añade un nuevo registro a la tabla 'mdr_discover'.
   *
   * @async
   * @function add
   * @param {Object} record - Objeto que representa el nuevo registro.
   * @returns {Promise<Object>} `{ success: true }` si la inserción fue exitosa.
   * @example
   * const registro = { mcc: { S: '1234' }, rate: { N: '2.5' } };
   * const result = await mdrDiscoverRepository.add(registro);
   */
  async add(record) {
    try {
      const params = {
        TableName: this.tableName,
        Item: record
      };
      return await this.dynamoClient.addItem(params);
    } catch (error) {
      logger.error(`Error en MdrDiscoverRepository.add: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Actualiza uno de los campos de un registro existente.
   *
   * @async
   * @function update
   * @param {string} mcc - MCC del registro a actualizar.
   * @param {string} field - Nombre del campo que se desea actualizar.
   * @param {any} newValue - Nuevo valor para ese campo.
   * @returns {Promise<Object>} `{ success: true }` si la actualización fue exitosa.
   * @example
   * await mdrDiscoverRepository.update('1234', 'rate', 3.0);
   */
  async update(mcc, field, newValue) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { mcc: { S: mcc } },
        UpdateExpression: 'SET #field = :value',
        ExpressionAttributeNames: {
          '#field': field
        },
        ExpressionAttributeValues: {
          ':value': typeof newValue === 'number' ? { N: newValue.toString() } : { S: newValue }
        }
      };
      return await this.dynamoClient.updateItem(params);
    } catch (error) {
      logger.error(`Error en MdrDiscoverRepository.update: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Elimina un registro por su MCC.
   *
   * @async
   * @function delete
   * @param {string} mcc - MCC del registro que se desea eliminar.
   * @returns {Promise<Object>} `{ success: true }` si la eliminación fue exitosa.
   * @example
   * await mdrDiscoverRepository.delete('1234');
   */
  async delete(mcc) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { mcc: { S: mcc } }
      };
      return await this.dynamoClient.deleteItem(params);
    } catch (error) {
      logger.error(`Error en MdrDiscoverRepository.delete: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Escanea todos los registros de la tabla 'mdr_discover'.
   *
   * @async
   * @function scan
   * @returns {Promise<Array<Object>>} Lista de registros o `[]` si no hay registros.
   * @example
   * const registros = await mdrDiscoverRepository.scan();
   */
  async scan() {
    try {
      const params = { TableName: this.tableName };
      return await this.dynamoClient.scanTable(params);
    } catch (error) {
      logger.error(`Error en MdrDiscoverRepository.scan: ${error.message}`, error);
      throw error;
    }
  }
}

module.exports = MdrDiscoverRepository;
