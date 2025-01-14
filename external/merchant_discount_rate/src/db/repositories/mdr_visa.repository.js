// src/db/repositories/mdr_visa.repository.js

/**
 * @file mdr_visa.repository.js
 * Repositorio para interactuar con la tabla 'mdr_visa' en DynamoDB.
 */

const DynamoDBServiceClient = require('../../db/client-dynamo.db.js');

class MdrVisaRepository {
  /**
   * Crea una instancia de MdrVisaRepository.
   */
  constructor() {
    this.DynamoDBServiceClient = new DynamoDBServiceClient();
    this.tableName = 'mdr_visa';
  }

  /**
   * Obtiene un registro por su MCC (Partition Key).
   * @async
   * @param {string} mcc - El Merchant Category Code (PK) que se desea obtener.
   * @returns {Promise<Object|null>} - El registro encontrado o `null` si no existe.
   * @example
   * const record = await mdrVisaRepository.getByMcc('5411');
   * console.log(record);
   */
  async getByMcc(mcc) {
    const params = {
      TableName: this.tableName,
      Key: { mcc: { S: mcc } },
    };
    const result = await this.DynamoDBServiceClient.getItem(params);
    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Añade un nuevo registro a la tabla 'mdr_visa'.
   * @async
   * @param {Object} record - Objeto que representa el nuevo registro.
   * @returns {Promise<Object>} - `{ success: true }` si la inserción fue exitosa.
   * @example
   * const newRecord = { mcc: '5411', debito_nacional_presencial_smartpos_rate: 1.50 };
   * const result = await mdrVisaRepository.add(newRecord);
   * console.log(result); // { success: true }
   */
  async add(record) {
    const params = {
      TableName: this.tableName,
      Item: record,
    };
    return await this.DynamoDBServiceClient.addItem(params);
  }

  /**
   * Actualiza uno de los campos de un registro existente.
   * @async
   * @param {string} mcc - MCC del registro a actualizar.
   * @param {string} field - Nombre del campo que se desea actualizar.
   * @param {any} newValue - Nuevo valor para ese campo.
   * @returns {Promise<Object>} - `{ success: true }` si la actualización fue exitosa.
   * @example
   * await mdrVisaRepository.update('5411', 'debito_nacional_presencial_smartpos_rate', 1.60);
   */
  async update(mcc, field, newValue) {
    const params = {
      TableName: this.tableName,
      Key: { mcc: { S: mcc } },
      UpdateExpression: 'SET #field = :value',
      ExpressionAttributeNames: {
        '#field': field,
      },
      ExpressionAttributeValues: {
        ':value':
          typeof newValue === 'number' ? { N: newValue.toString() } : { S: newValue },
      },
    };
    return await this.DynamoDBServiceClient.updateItem(params);
  }

  /**
   * Elimina un registro por su MCC.
   * @async
   * @param {string} mcc - MCC del registro que se desea eliminar.
   * @returns {Promise<Object>} - `{ success: true }` si la eliminación fue exitosa.
   * @example
   * await mdrVisaRepository.delete('5411');
   */
  async delete(mcc) {
    const params = {
      TableName: this.tableName,
      Key: { mcc: { S: mcc } },
    };
    return await this.DynamoDBServiceClient.deleteItem(params);
  }

  /**
   * Escanea todos los registros de la tabla 'mdr_visa'.
   * @async
   * @returns {Promise<Array<Object>>} - Lista de registros o `[]` si no hay registros.
   * @example
   * const records = await mdrVisaRepository.scan();
   */
  async scan() {
    const params = {
      TableName: this.tableName,
    };
    return await this.DynamoDBServiceClient.scanTable(params);
  }
}

module.exports = MdrVisaRepository;
