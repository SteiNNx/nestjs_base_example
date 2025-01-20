// src/db/client-dynamo.db.js

/**
 * @file client-dynamo.db.js
 * Servicio genérico para interactuar con DynamoDB.
 * Proporciona métodos CRUD y operaciones de escaneo y consulta.
 */

const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
  QueryCommand,
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
      dynamoDbConnectionTimeOut
    } = getDynamoDbConfig();

    // Se evita loggear información sensible.
    logger.info(`Inicializando cliente DynamoDB en la región: ${awsRegion}`);

    // Configuración del requestHandler con timeout personalizado.
    const requestHandler = new NodeHttpHandler({
      connectionTimeout: dynamoDbConnectionTimeOut,
      socketTimeout: dynamoDbConnectionTimeOut,
    });

    this.dynamoDBClient = new DynamoDBClient({
      region: awsRegion,
      endpoint: dynamoDbEndpoint,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
      maxAttempts: dynamoDbMaxAttempts,
      requestHandler,
    });

    // Configuración del middleware para registrar el proceso de cada comando.
    this._setupMiddleware();
  }

  /**
   * Configura el middleware para el cliente de DynamoDB.
   * Este middleware registra el inicio y fin de cada comando,
   * incluyendo el tiempo de ejecución.
   *
   * @private
   */
  _setupMiddleware() {
    this.dynamoDBClient.middlewareStack.add(
      (next, context) => async (args) => {
        logger.info(`[middlewareDb] Iniciando: ${context.commandName}`);
        const startTime = Date.now();
        try {
          const result = await next(args);
          const duration = Date.now() - startTime;
          logger.info(`[middlewareDb] ${context.commandName} completado en ${duration}ms`);
          return result;
        } catch (error) {
          logger.error(`[middlewareDb] Error en ${context.commandName}: ${error.message}`, error);
          throw error;
        }
      },
      { step: 'initialize' }
    );
  }

  /**
   * Método privado que centraliza la ejecución de los comandos.
   *
   * @private
   * @param {Object} command - Instancia del comando a ejecutar.
   * @param {Function} [transform] - Función para transformar el resultado.
   * @returns {Promise<*>} Resultado transformado o el resultado original.
   */
  async _executeCommand(command, transform = (result) => result) {
    try {
      const result = await this.dynamoDBClient.send(command);
      return transform(result);
    } catch (error) {
      logger.error(`Error al ejecutar ${command.constructor.name}: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Obtiene un ítem de DynamoDB.
   *
   * @async
   * @param {Object} params - Parámetros para la operación GetItem.
   * @returns {Promise<Object>} Objeto obtenido o `{}` si no existe.
   * @example
   * const params = {
   *   TableName: 'my_table',
   *   Key: { id: { S: '123' } }
   * };
   * const item = await clientDynamoDb.getItem(params);
   */
  async getItem(params) {
    const command = new GetItemCommand(params);
    return this._executeCommand(command, (result) =>
      result.Item ? unmarshall(result.Item) : {}
    );
  }

  /**
   * Añade (o reemplaza) un ítem en DynamoDB.
   *
   * @async
   * @param {Object} params - Parámetros para la operación PutItem.
   * @returns {Promise<Object>} Objeto con `{ success: true }` si la operación fue exitosa.
   * @example
   * const params = {
   *   TableName: 'my_table',
   *   Item: marshall({ id: '456', nombre: 'Nuevo' })
   * };
   * const result = await clientDynamoDb.addItem(params);
   */
  async addItem(params) {
    const command = new PutItemCommand(params);
    await this._executeCommand(command);
    return { success: true };
  }

  /**
   * Actualiza un ítem en DynamoDB.
   *
   * @async
   * @param {Object} params - Parámetros para la operación UpdateItem.
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
    const command = new UpdateItemCommand(params);
    await this._executeCommand(command);
    return { success: true };
  }

  /**
   * Elimina un ítem de DynamoDB.
   *
   * @async
   * @param {Object} params - Parámetros para la operación DeleteItem.
   * @returns {Promise<Object>} Objeto con `{ success: true }` si la eliminación fue exitosa.
   * @example
   * const params = {
   *   TableName: 'my_table',
   *   Key: { id: { S: '456' } }
   * };
   * const result = await clientDynamoDb.deleteItem(params);
   */
  async deleteItem(params) {
    const command = new DeleteItemCommand(params);
    await this._executeCommand(command);
    return { success: true };
  }

  /**
   * Escanea (scan) una tabla completa en DynamoDB.
   *
   * @async
   * @param {Object} params - Parámetros para la operación Scan.
   * @returns {Promise<Array<Object>>} Array de ítems encontrados o `[]` si no hay registros.
   * @example
   * const params = { TableName: 'my_table' };
   * const items = await clientDynamoDb.scanTable(params);
   */
  async scanTable(params) {
    const command = new ScanCommand(params);
    return this._executeCommand(command, (result) =>
      result.Items ? result.Items.map((item) => unmarshall(item)) : []
    );
  }

  /**
   * Consulta (query) una tabla en DynamoDB según una condición de clave.
   *
   * @async
   * @param {Object} params - Parámetros para la operación Query.
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
    const command = new QueryCommand(params);
    return this._executeCommand(command, (result) =>
      result.Items ? result.Items.map((item) => unmarshall(item)) : []
    );
  }
}

module.exports = ClientDynamoDb;
