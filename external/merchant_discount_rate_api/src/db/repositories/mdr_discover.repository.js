// src/db/repositories/mdr_discover.repository.js

/**
 * @file mdr_discover.repository.js
 * @description Repositorio para interactuar con la tabla 'mdr_discover' en DynamoDB.
 */

const { getDynamoDbTablesNames } = require('../../providers/credentials.provider');
const ClientDynamoDb = require('../client.dynamodb');
const LoggerHelper = require('../../helpers/logger.helper');

const logger = new LoggerHelper('mdr_discover.repository.js');

class MdrDiscoverRepository {
  /**
   * Crea una instancia de MdrDiscoverRepository para la tabla 'mdr_discover'.
   */
  constructor() {
    const { tableNameMdrAmex } = getDynamoDbTablesNames();
    this.dynamoClient = new ClientDynamoDb();
    this.tableName = tableNameMdrAmex;
  }

  /**
   * Obtiene un registro por su MCC (Partition Key).
   *
   * @async
   * @function getByMcc
   * @param {string} mcc - MCC que se desea obtener.
   * @returns {Promise<Object|null>} El registro encontrado o `null` si no existe.
   * @example
   * const registro = await mdrDiscoverRepository.getByMcc('5411');
   */
  async getByMcc(mcc) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { mcc: { S: mcc } },
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
   * @param {Object} record - Objeto formateado para DynamoDB, ej. { mcc: { S: '5411' }, rate: { N: '1.50' } }.
   * @returns {Promise<Object>} `{ success: true }` si la inserción fue exitosa.
   * @example
   * const registro = { mcc: { S: '5411' }, debito_nacional_presencial_smartpos_rate: { N: '1.50' } };
   * const result = await mdrDiscoverRepository.add(registro);
   */
  async add(record) {
    try {
      const params = {
        TableName: this.tableName,
        Item: record,
      };
      return await this.dynamoClient.addItem(params);
    } catch (error) {
      logger.error(`Error en MdrDiscoverRepository.add: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Actualiza un solo campo de un registro existente en la tabla 'mdr_discover'.
   *
   * @async
   * @function update
   * @param {string} mcc - MCC del registro a actualizar.
   * @param {string} field - Nombre del campo que se desea actualizar.
   * @param {any} newValue - Nuevo valor para el campo.
   * @returns {Promise<Object>} `{ success: true }` si la actualización fue exitosa.
   * @example
   * await mdrDiscoverRepository.update('5411', 'debito_nacional_presencial_smartpos_rate', 1.60);
   */
  async update(mcc, field, newValue) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { mcc: { S: mcc } },
        UpdateExpression: 'SET #field = :value',
        ExpressionAttributeNames: { '#field': field },
        ExpressionAttributeValues: {
          ':value':
            typeof newValue === 'number'
              ? { N: newValue.toString() }
              : { S: newValue.toString() },
        },
      };
      return await this.dynamoClient.updateItem(params);
    } catch (error) {
      logger.error(`Error en MdrDiscoverRepository.update: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Actualiza varios campos de un registro existente en la tabla 'mdr_discover'.
   * Se construye una sola UpdateExpression para todos los pares campo-valor de 'updateData'.
   *
   * @async
   * @function updateMultipleFields
   * @param {string} mcc - MCC del registro a actualizar.
   * @param {Object} updateData - Objeto con los campos y valores a actualizar.
   * @returns {Promise<Object>} Un objeto con { success: true, updatedFields: [...] }.
   * @example
   * const fieldsToUpdate = { debito_nacional_presencial_smartpos_rate: 1.99 };
   * await mdrDiscoverRepository.updateMultipleFields('5411', fieldsToUpdate);
   */
  async updateMultipleFields(mcc, updateData) {
    try {
      logger.info(`Actualizando múltiples campos para mcc=${mcc} en ${this.tableName}`);

      const UpdateExpressionParts = [];
      const ExpressionAttributeNames = {};
      const ExpressionAttributeValues = {};

      let index = 1;
      for (const [field, value] of Object.entries(updateData)) {
        const fieldName = `#f${index}`;
        const fieldValue = `:v${index}`;

        UpdateExpressionParts.push(`${fieldName} = ${fieldValue}`);
        ExpressionAttributeNames[fieldName] = field;

        if (typeof value === 'number') {
          ExpressionAttributeValues[fieldValue] = { N: value.toString() };
        } else {
          ExpressionAttributeValues[fieldValue] = { S: value.toString() };
        }

        index += 1;
      }

      const UpdateExpression = 'SET ' + UpdateExpressionParts.join(', ');

      const params = {
        TableName: this.tableName,
        Key: { mcc: { S: mcc } },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      };

      await this.dynamoClient.updateItem(params);
      return { success: true, updatedFields: Object.keys(updateData) };
    } catch (error) {
      logger.error(`Error en MdrDiscoverRepository.updateMultipleFields: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Elimina un registro por su MCC en la tabla 'mdr_discover'.
   *
   * @async
   * @function delete
   * @param {string} mcc - MCC del registro a eliminar.
   * @returns {Promise<Object>} `{ success: true }` si la eliminación fue exitosa.
   * @example
   * await mdrDiscoverRepository.delete('5411');
   */
  async delete(mcc) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { mcc: { S: mcc } },
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
   * @returns {Promise<Array<Object>>} Lista de registros o `[]`.
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
