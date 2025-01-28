// src/db/repositories/mdr_amex.repository.js

/**
 * @file mdr_amex.repository.js
 * @description Repositorio para interactuar con la tabla 'mdr_amex' en DynamoDB.
 */

const ClientDynamoDb = require('../client.dynamodb');

const LoggerHelper = require('../../helpers/logger.helper');
const logger = new LoggerHelper('mdr_amex.repository.js');

class MdrAmexRepository {
  /**
   * Crea una instancia de MdrAmexRepository para la tabla 'mdr_amex'.
   */
  constructor() {
    this.dynamoClient = new ClientDynamoDb();
    this.tableName = 'mdr_amex';
  }

  /**
   * Obtiene un registro por su MCC (Partition Key).
   *
   * @async
   * @function getByMcc
   * @param {string} mcc - MCC que se desea obtener.
   * @returns {Promise<Object|null>} Objeto con los datos del registro o `null` si no existe.
   * @example
   * const registro = await mdrAmexRepository.getByMcc('5411');
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
      logger.error(`Error en getByMcc: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Añade un nuevo registro a la tabla 'mdr_amex'.
   *
   * @async
   * @function add
   * @param {Object} record - Objeto ya formateado para DynamoDB (ej. { mcc: { S: '5411' }, rate: { N: '1.50' } }).
   * @returns {Promise<Object>} Retorna `{ success: true }` si la inserción fue exitosa.
   * @example
   * const nuevoRegistro = { mcc: { S: '5411' }, debito_nacional_presencial_smartpos_rate: { N: '1.50' } };
   * const result = await mdrAmexRepository.add(nuevoRegistro);
   */
  async add(record) {
    try {
      const params = {
        TableName: this.tableName,
        Item: record,
      };
      return await this.dynamoClient.addItem(params);
    } catch (error) {
      logger.error(`Error en add: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Actualiza un solo campo de un registro existente en la tabla 'mdr_amex'.
   *
   * @async
   * @function update
   * @param {string} mcc - MCC del registro a actualizar.
   * @param {string} field - Nombre del campo que se desea actualizar.
   * @param {any} newValue - Nuevo valor para el campo (número, string, etc.).
   * @returns {Promise<Object>} `{ success: true }` si la actualización fue exitosa.
   * @example
   * await mdrAmexRepository.update('5411', 'debito_nacional_presencial_smartpos_rate', 1.70);
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
      logger.error(`Error en update: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Actualiza varios campos de un registro existente en la tabla 'mdr_amex' en una sola operación.
   * Construye dinámicamente una UpdateExpression para cada par campo-valor en 'updateData'.
   *
   * @async
   * @function updateMultipleFields
   * @param {string} mcc - MCC del registro a actualizar.
   * @param {Object} updateData - Objeto con los campos y valores a actualizar, p. ej.:
   *   {
   *     "debito_nacional_presencial_smartpos_rate": 1.90,
   *     "debito_nacional_presencial_smartpos_uf": 0.05
   *   }
   * @returns {Promise<Object>} Un objeto con { success: true, updatedFields: [...] }.
   * @example
   * const fieldsToUpdate = {
   *   debito_nacional_presencial_smartpos_rate: 1.95,
   *   credito_nacional_ecommerce_online_uf: 0.09
   * };
   * await mdrAmexRepository.updateMultipleFields('5411', fieldsToUpdate);
   */
  async updateMultipleFields(mcc, updateData) {
    try {
      logger.info(`Actualizando múltiples campos para mcc=${mcc} en ${this.tableName}`);

      // Construir dinámicamente la UpdateExpression: "SET #f1 = :v1, #f2 = :v2, ..."
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

      const result = await this.dynamoClient.updateItem(params);
      return { success: true, updatedFields: Object.keys(updateData) };
    } catch (error) {
      logger.error(`Error en updateMultipleFields: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Elimina un registro de la tabla 'mdr_amex' por su MCC.
   *
   * @async
   * @function delete
   * @param {string} mcc - MCC del registro a eliminar.
   * @returns {Promise<Object>} `{ success: true }` si la eliminación fue exitosa.
   * @example
   * await mdrAmexRepository.delete('5411');
   */
  async delete(mcc) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { mcc: { S: mcc } },
      };
      return await this.dynamoClient.deleteItem(params);
    } catch (error) {
      logger.error(`Error en delete: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Escanea todos los registros de la tabla 'mdr_amex'.
   *
   * @async
   * @function scan
   * @returns {Promise<Array<Object>>} Lista de registros o `[]` si no hay registros.
   * @example
   * const registros = await mdrAmexRepository.scan();
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

module.exports = MdrAmexRepository;
