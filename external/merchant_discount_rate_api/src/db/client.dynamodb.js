// src/db/client-dynamo.db.js

/**
 * @file client-dynamo.db.js
 * Servicio para interactuar con DynamoDB. Provee métodos CRUD y operaciones de escaneo y consulta.
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
  ListTablesCommand,
} = require('@aws-sdk/client-dynamodb');

const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { getDynamoDbConfig } = require('../providers/credentials.provider');

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
      dynamoDbConnectionTimeOut,
    } = getDynamoDbConfig();

    logger.info('Inicializando DynamoDB Client', {
      awsAccessKeyId,
      awsRegion,
      dynamoDbEndpoint,
      dynamoDbMaxAttempts,
      dynamoDbConnectionTimeOut,
    });

    // Configuración del requestHandler con timeout personalizado (3000ms)
    const requestHandler = new NodeHttpHandler({
      connectionTimeout: dynamoDbConnectionTimeOut, // Tiempo para establecer conexión (ms)
      socketTimeout: dynamoDbConnectionTimeOut,     // Tiempo de espera para el socket (ms)
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

    // Middleware para registrar el inicio y fin de cada comando, midiendo su duración
    this.dynamoDBClient.middlewareStack.add(
      (next, context) => async (args) => {
        logger.info(`[DynamoDB] Iniciando: ${context.commandName}`);
        const startTime = Date.now();
        try {
          const result = await next(args);
          const duration = Date.now() - startTime;
          logger.info(`[DynamoDB] ${context.commandName} completado en ${duration}ms`);
          return result;
        } catch (error) {
          logger.error(`[DynamoDB] Error en ${context.commandName}: ${error.message}`, error);
          throw error;
        }
      },
      {
        step: 'initialize',
      }
    );
    // Se lista todas las tablas en DynamoDB para verificar la conexión y que se haya llegado correctamente
    // this.dynamoDBClient.send(new ListTablesCommand({}))
    //   .then((response) => {
    //     logger.info('Tablas en DynamoDB:', response.TableNames);
    //   })
    //   .catch((error) => {
    //     logger.error('Error al listar las tablas', error);
    //   });
  }

  /**
   * Método privado para ejecutar un comando de DynamoDB y aplicar una transformación al resultado.
   *
   * @param {Object} command - Instancia del comando a ejecutar.
   * @param {Function} transform - Función para transformar el resultado (por defecto retorna el resultado original).
   * @returns {Promise<any>} Resultado transformado.
   */
  async _executeCommand(command, transform = (res) => res) {
    try {
      const result = await this.dynamoDBClient.send(command);
      return transform(result);
    } catch (error) {
      logger.error(`Error en ${command.constructor.name}: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Obtiene un ítem de DynamoDB.
   *
   * @param {Object} params - Parámetros para la operación GetItem.
   * @returns {Promise<Object>} Objeto obtenido o `{}` si no existe.
   */
  async getItem(params) {
    return this._executeCommand(
      new GetItemCommand(params),
      (result) => (result.Item ? unmarshall(result.Item) : {})
    );
  }

  /**
   * Añade (o reemplaza) un ítem en DynamoDB.
   *
   * @param {Object} params - Parámetros para la operación PutItem.
   * @returns {Promise<Object>} Objeto con `{ success: true }` si la operación fue exitosa.
   */
  async addItem(params) {
    await this._executeCommand(new PutItemCommand(params));
    return { success: true };
  }

  /**
   * Actualiza un ítem en DynamoDB.
   *
   * @param {Object} params - Parámetros para la operación UpdateItem.
   * @returns {Promise<Object>} Objeto con `{ success: true }` si la actualización fue exitosa.
   */
  async updateItem(params) {
    await this._executeCommand(new UpdateItemCommand(params));
    return { success: true };
  }

  /**
   * Elimina un ítem de DynamoDB.
   *
   * @param {Object} params - Parámetros para la operación DeleteItem.
   * @returns {Promise<Object>} Objeto con `{ success: true }` si la eliminación fue exitosa.
   */
  async deleteItem(params) {
    await this._executeCommand(new DeleteItemCommand(params));
    return { success: true };
  }

  /**
   * Escanea (scan) una tabla completa en DynamoDB.
   *
   * @param {Object} params - Parámetros para la operación Scan.
   * @returns {Promise<Array<Object>>} Array de ítems encontrados o `[]` si no hay registros.
   */
  async scanTable(params) {
    return this._executeCommand(
      new ScanCommand(params),
      (result) => (result.Items ? result.Items.map((item) => unmarshall(item)) : [])
    );
  }

  /**
   * Consulta (query) una tabla en DynamoDB según una condición de clave.
   *
   * @param {Object} params - Parámetros para la operación Query.
   * @returns {Promise<Array<Object>>} Array de ítems que cumplen la condición o `[]`.
   */
  async queryTable(params) {
    return this._executeCommand(
      new QueryCommand(params),
      (result) => (result.Items ? result.Items.map((item) => unmarshall(item)) : [])
    );
  }
}

module.exports = ClientDynamoDb;
