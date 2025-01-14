
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
    QueryCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const config = require('../config/config');

class ClientDynamoDb {
    /**
     * Crea una instancia de ClientDynamoDb y configura el cliente DynamoDB según `config`.
     */
    constructor() {
        this.dynamoDBClient = new DynamoDBClient({
            region: config.dynamodb.region,
            endpoint: config.dynamodb.endpoint,
            credentials: {
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey,
            },
            maxRetries: config.dynamodb.maxRetries,
        });
    }

    /**
     * Obtiene un ítem de DynamoDB.
     * @async
     * @param {Object} params - Parámetros para la operación `GetItem`.
     * @param {string} params.TableName - Nombre de la tabla.
     * @param {Object} params.Key - Clave primaria del ítem a obtener (ya en formato DynamoDB o usando `marshall`).
     * @returns {Promise<Object>} - El ítem encontrado como un objeto de JavaScript o un objeto vacío `{}` si no existe.
     * @example
     * const params = {
     *   TableName: 'my_table',
     *   Key: { id: { S: '123' } }
     * };
     * const item = await clientDynamoDb.getItem(params);
     * console.log(item); // { id: '123', nombre: 'ejemplo' } o {}
     */
    async getItem(params) {
        const command = new GetItemCommand(params);
        const result = await this.dynamoDBClient.send(command);
        return result.Item ? unmarshall(result.Item) : {};
    }

    /**
     * Añade (o reemplaza) un ítem en DynamoDB.
     * @async
     * @param {Object} params - Parámetros para la operación `PutItem`.
     * @param {string} params.TableName - Nombre de la tabla.
     * @param {Object} params.Item - Ítem a insertar (reemplaza el existente si coincide la PK).
     * @returns {Promise<Object>} - Un objeto con `{ success: true }` indicando la inserción exitosa.
     * @example
     * const params = {
     *   TableName: 'my_table',
     *   Item: marshall({ id: '456', nombre: 'Nuevo' })
     * };
     * const result = await clientDynamoDb.addItem(params);
     * console.log(result); // { success: true }
     */
    async addItem(params) {
        const command = new PutItemCommand(params);
        await this.dynamoDBClient.send(command);
        return { success: true };
    }

    /**
     * Actualiza un ítem en DynamoDB.
     * @async
     * @param {Object} params - Parámetros para la operación `UpdateItem`.
     * @param {string} params.TableName - Nombre de la tabla.
     * @param {Object} params.Key - Clave primaria del ítem a actualizar.
     * @param {string} params.UpdateExpression - Expresión que define cómo se actualizarán los atributos.
     * @param {Object} params.ExpressionAttributeValues - Valores que se sustituyen en la expresión de actualización.
     * @returns {Promise<Object>} - Un objeto con `{ success: true }` indicando la actualización exitosa.
     * @example
     * const params = {
     *   TableName: 'my_table',
     *   Key: { id: { S: '456' } },
     *   UpdateExpression: 'SET #nombre = :nombre',
     *   ExpressionAttributeNames: { '#nombre': 'nombre' },
     *   ExpressionAttributeValues: { ':nombre': { S: 'Nombre Actualizado' } }
     * };
     * const result = await clientDynamoDb.updateItem(params);
     * console.log(result); // { success: true }
     */
    async updateItem(params) {
        const command = new UpdateItemCommand(params);
        await this.dynamoDBClient.send(command);
        return { success: true };
    }

    /**
     * Elimina un ítem de DynamoDB.
     * @async
     * @param {Object} params - Parámetros para la operación `DeleteItem`.
     * @param {string} params.TableName - Nombre de la tabla.
     * @param {Object} params.Key - Clave primaria del ítem a eliminar.
     * @returns {Promise<Object>} - Un objeto con `{ success: true }` indicando la eliminación exitosa.
     * @example
     * const params = {
     *   TableName: 'my_table',
     *   Key: { id: { S: '456' } }
     * };
     * const result = await clientDynamoDb.deleteItem(params);
     * console.log(result); // { success: true }
     */
    async deleteItem(params) {
        const command = new DeleteItemCommand(params);
        await this.dynamoDBClient.send(command);
        return { success: true };
    }

    /**
     * Escanea (scan) una tabla completa en DynamoDB.
     * @async
     * @param {Object} params - Parámetros para la operación `Scan`.
     * @param {string} params.TableName - Nombre de la tabla a escanear.
     * @returns {Promise<Array<Object>>} - Array de ítems encontrados (convertidos a objetos JS) o un array vacío `[]`.
     * @example
     * const params = {
     *   TableName: 'my_table'
     * };
     * const items = await clientDynamoDb.scanTable(params);
     * console.log(items); // [{ id: '1', ... }, { id: '2', ... }]
     */
    async scanTable(params) {
        const command = new ScanCommand(params);
        const result = await this.dynamoDBClient.send(command);
        return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
    }

    /**
     * Consulta (query) una tabla en DynamoDB según una condición de clave.
     * @async
     * @param {Object} params - Parámetros para la operación `Query`.
     * @param {string} params.TableName - Nombre de la tabla.
     * @param {string} params.KeyConditionExpression - Expresión que define la condición de las claves.
     * @param {Object} params.ExpressionAttributeValues - Valores sustitutos para la expresión de condición.
     * @returns {Promise<Array<Object>>} - Array de ítems que cumplen la condición o `[]` si no hay coincidencias.
     * @example
     * const params = {
     *   TableName: 'my_table',
     *   KeyConditionExpression: 'id = :idVal',
     *   ExpressionAttributeValues: {
     *     ':idVal': { S: '123' }
     *   }
     * };
     * const items = await clientDynamoDb.queryTable(params);
     * console.log(items); // [{ id: '123', nombre: 'ejemplo' }]
     */
    async queryTable(params) {
        const command = new QueryCommand(params);
        const result = await this.dynamoDBClient.send(command);
        return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
    }
}

module.exports = ClientDynamoDb;
