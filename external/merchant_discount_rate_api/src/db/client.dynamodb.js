
// src/db/client-dynamo.db.js

/**
 * @file client-dynamo.db.js
 * Servicio genérico para interactuar con DynamoDB.
 * Proporciona métodos CRUD y operaciones de escaneo y consulta.
 */

const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
  QueryCommand
} = require('@aws-sdk/client-dynamodb');

const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { getDynamoDbConfig } = require('../providers/credentials.provider');
const config = require('../config/config');

const LoggerHelper = require('../helpers/logger.helper');
const logger = new LoggerHelper('client-dynamo.db.js');

class ClientDynamoDb {
  /**
   * Crea una instancia de ClientDynamoDb y configura el cliente DynamoDB.
   */
  constructor() {
    const {
      awsAccessKeyId,
      awsSecretAccessKey,
      awsRegion,
      dynamoDbEndpoint,
      dynamoDbMaxAttempts,
    } = getDynamoDbConfig();

    this.dynamoDBClient = new DynamoDBClient({
      region: awsRegion,
      endpoint: dynamoDbEndpoint,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
      maxAttempts: dynamoDbMaxAttempts,
    });
  }

  /**
   * Obtiene un ítem de DynamoDB.
   *
   * @async
   * @function getItem
   * @param {Object} params - Parámetros para la operación GetItem.
   * @param {string} params.TableName - Nombre de la tabla.
   * @param {Object} params.Key - Clave primaria del ítem (formateada para DynamoDB o utilizando marshall).
   * @returns {Promise<Object>} Objeto obtenido o `{}` si no existe.
   * @example
   * const params = {
   *   TableName: 'my_table',
   *   Key: { id: { S: '123' } }
   * };
   * const item = await clientDynamoDb.getItem(params);
   */
  async getItem(params) {
    try {
      const command = new GetItemCommand(params);
      const result = await this.dynamoDBClient.send(command);
      return result.Item ? unmarshall(result.Item) : {};
    } catch (error) {
      logger.error(`Error en getItem: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Añade (o reemplaza) un ítem en DynamoDB.
   *
   * @async
   * @function addItem
   * @param {Object} params - Parámetros para la operación PutItem.
   * @param {string} params.TableName - Nombre de la tabla.
   * @param {Object} params.Item - Ítem a insertar (en formato DynamoDB).
   * @returns {Promise<Object>} Objeto con `{ success: true }` si la operación fue exitosa.
   * @example
   * const params = {
   *   TableName: 'my_table',
   *   Item: marshall({ id: '456', nombre: 'Nuevo' })
   * };
   * const result = await clientDynamoDb.addItem(params);
   */
  async addItem(params) {
    try {
      const command = new PutItemCommand(params);
      await this.dynamoDBClient.send(command);
      return { success: true };
    } catch (error) {
      logger.error(`Error en addItem: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Actualiza un ítem en DynamoDB.
   *
   * @async
   * @function updateItem
   * @param {Object} params - Parámetros para la operación UpdateItem.
   * @param {string} params.TableName - Nombre de la tabla.
   * @param {Object} params.Key - Clave primaria del ítem a actualizar.
   * @param {string} params.UpdateExpression - Expresión que define la actualización.
   * @param {Object} params.ExpressionAttributeValues - Valores para la actualización.
   * @returns {Promise<Object>} Objeto con `{ success: true }` si la actualización fue exitosa.
   * @example
   * const params = {
   *   TableName: 'my_table',
   *   Key: { id: { S: '456' } },
   *   UpdateExpression: 'SET #nombre = :nombre',
   *   ExpressionAttributeNames: { '#nombre': 'nombre' },
   *   ExpressionAttributeValues: { ':nombre': { S: 'Nombre Actualizado' } }
   * };
   * const result = await clientDynamoDb.updateItem(params);
   */
  async updateItem(params) {
    try {
      const command = new UpdateItemCommand(params);
      await this.dynamoDBClient.send(command);
      return { success: true };
    } catch (error) {
      logger.error(`Error en updateItem: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Elimina un ítem de DynamoDB.
   *
   * @async
   * @function deleteItem
   * @param {Object} params - Parámetros para la operación DeleteItem.
   * @param {string} params.TableName - Nombre de la tabla.
   * @param {Object} params.Key - Clave primaria del ítem a eliminar.
   * @returns {Promise<Object>} Objeto con `{ success: true }` si la eliminación fue exitosa.
   * @example
   * const params = {
   *   TableName: 'my_table',
   *   Key: { id: { S: '456' } }
   * };
   * const result = await clientDynamoDb.deleteItem(params);
   */
  async deleteItem(params) {
    try {
      const command = new DeleteItemCommand(params);
      await this.dynamoDBClient.send(command);
      return { success: true };
    } catch (error) {
      logger.error(`Error en deleteItem: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Escanea (scan) una tabla completa en DynamoDB.
   *
   * @async
   * @function scanTable
   * @param {Object} params - Parámetros para la operación Scan.
   * @param {string} params.TableName - Nombre de la tabla a escanear.
   * @returns {Promise<Array<Object>>} Array de ítems encontrados o `[]` si no hay registros.
   * @example
   * const params = { TableName: 'my_table' };
   * const items = await clientDynamoDb.scanTable(params);
   */
  async scanTable(params) {
    try {
      const command = new ScanCommand(params);
      const result = await this.dynamoDBClient.send(command);
      return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
    } catch (error) {
      logger.error(`Error en scanTable: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Consulta (query) una tabla en DynamoDB según una condición de clave.
   *
   * @async
   * @function queryTable
   * @param {Object} params - Parámetros para la operación Query.
   * @param {string} params.TableName - Nombre de la tabla.
   * @param {string} params.KeyConditionExpression - Expresión que define la condición.
   * @param {Object} params.ExpressionAttributeValues - Valores sustitutos para la condición.
   * @returns {Promise<Array<Object>>} Array de ítems que cumplen la condición o `[]`.
   * @example
   * const params = {
   *   TableName: 'my_table',
   *   KeyConditionExpression: 'id = :idVal',
   *   ExpressionAttributeValues: { ':idVal': { S: '123' } }
   * };
   * const items = await clientDynamoDb.queryTable(params);
   */
  async queryTable(params) {
    try {
      const command = new QueryCommand(params);
      const result = await this.dynamoDBClient.send(command);
      return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
    } catch (error) {
      logger.error(`Error en queryTable: ${error.message}`, error);
      throw error;
    }
  }
}

module.exports = ClientDynamoDb;
