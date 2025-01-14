/**
 * @file mdr_amex.repository.js
 * Repositorio para interactuar con la tabla 'mdr_amex' en DynamoDB.
 */

const DynamoDBServiceClient = require('../../db/client-dynamo.db.js');

class MdrAmexRepository {
    /**
     * Crea una instancia de MdrAmexRepository.
     */
    constructor() {
        this.DynamoDBServiceClient = new DynamoDBServiceClient();
        this.tableName = 'mdr_amex';
    }

    /**
     * Obtiene un registro por su MCC (Partition Key).
     * @async
     * @param {string} mcc - MCC que se desea obtener.
     * @returns {Promise<Object|null>} - El registro encontrado o `null` si no existe.
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
     * Añade un nuevo registro a la tabla 'mdr_amex'.
     * @async
     * @param {Object} record - Objeto que representa el nuevo registro.
     * @returns {Promise<Object>} - `{ success: true }` si la inserción fue exitosa.
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
     */
    async delete(mcc) {
        const params = {
            TableName: this.tableName,
            Key: { mcc: { S: mcc } },
        };
        return await this.DynamoDBServiceClient.deleteItem(params);
    }

    /**
     * Escanea todos los registros de la tabla 'mdr_amex'.
     * @async
     * @returns {Promise<Array<Object>>} - Lista de registros o `[]` si no hay registros.
     */
    async scan() {
        const params = {
            TableName: this.tableName,
        };
        return await this.DynamoDBServiceClient.scanTable(params);
    }
}

module.exports = MdrAmexRepository;
