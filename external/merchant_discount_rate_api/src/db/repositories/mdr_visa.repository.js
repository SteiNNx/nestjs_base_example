// src/db/repositories/mdr_visa.repository.js

/**
 * @file mdr_visa.repository.js
 * Repositorio para interactuar con la tabla 'mdr_visa' en DynamoDB.
 */

const ClientDynamoDb = require('../client.dynamodb');
const LoggerHelper = require('../../helpers/logger.helper');

const logger = new LoggerHelper('mdr_visa.repository.js');

class MdrVisaRepository {
  /**
   * Crea una instancia de MdrVisaRepository.
   */
  constructor() {
    this.dynamoClient = new ClientDynamoDb();
    this.tableName = 'mdr_visa';
  }

  /**
   * Obtiene un registro por su MCC (Partition Key).
   *
   * @async
   * @function getByMcc
   * @param {string} mcc - El Merchant Category Code (PK) que se desea obtener.
   * @returns {Promise<Object|null>} El registro encontrado o `null` si no existe.
   * @example
   * const record = await mdrVisaRepository.getByMcc('5411');
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
      logger.error(`Error en MdrVisaRepository.getByMcc: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Añade un nuevo registro a la tabla 'mdr_visa'.
   *
   * @async
   * @function add
   * @param {Object} record - Objeto que representa el nuevo registro.
   * @returns {Promise<Object>} `{ success: true }` si la inserción fue exitosa.
   * @example
   * const newRecord = { mcc: { S: '5411' }, debito_nacional_presencial_smartpos_rate: { N: '1.50' } };
   * const result = await mdrVisaRepository.add(newRecord);
   */
  async add(record) {
    try {
      const params = {
        TableName: this.tableName,
        Item: record
      };
      return await this.dynamoClient.addItem(params);
    } catch (error) {
      logger.error(`Error en MdrVisaRepository.add: ${error.message}`, error);
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
   * await mdrVisaRepository.update('5411', 'debito_nacional_presencial_smartpos_rate', 1.60);
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
      logger.error(`Error en MdrVisaRepository.update: ${error.message}`, error);
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
   * await mdrVisaRepository.delete('5411');
   */
  async delete(mcc) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { mcc: { S: mcc } }
      };
      return await this.dynamoClient.deleteItem(params);
    } catch (error) {
      logger.error(`Error en MdrVisaRepository.delete: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Escanea todos los registros de la tabla 'mdr_visa'.
   *
   * @async
   * @function scan
   * @returns {Promise<Array<Object>>} Lista de registros o `[]` si no hay registros.
   * @example
   * const records = await mdrVisaRepository.scan();
   */
  async scan() {
    try {
      const params = { TableName: this.tableName };
      return await this.dynamoClient.scanTable(params);
    } catch (error) {
      logger.error(`Error en MdrVisaRepository.scan: ${error.message}`, error);
      throw error;
    }
  }
}

module.exports = MdrVisaRepository;
