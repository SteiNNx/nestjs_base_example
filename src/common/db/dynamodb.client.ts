// src/common/db/dynamodb.client.ts

import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBService {
    private readonly client: DynamoDBClient;
    private readonly logger = new Logger(DynamoDBService.name);

    constructor(private readonly configService: ConfigService) {
        this.client = new DynamoDBClient({
            region: this.configService.get<string>('dynamoDB.region', 'us-west-2'),
            credentials: {
                accessKeyId: this.configService.get<string>('dynamoDB.accessKeyId', 'fakeAccessKeyId123'),
                secretAccessKey: this.configService.get<string>('dynamoDB.secretAccessKey', 'fakeSecretAccessKey123'),
            },
            endpoint: this.configService.get<string>('dynamoDB.endpoint', 'http://localhost:8000'),
        });
    }

    /**
     * Inserta un ítem en la tabla DynamoDB especificada.
     * @param tableName Nombre de la tabla.
     * @param item El ítem a insertar.
     * @returns true si la operación fue exitosa, false en caso contrario.
     */
    async putItem(tableName: string, item: Record<string, any>): Promise<boolean> {
        try {
            const command = new PutItemCommand({
                TableName: tableName,
                Item: item,
            });
            await this.client.send(command);
            return true;
        } catch (error) {
            this.logger.error(`Error al insertar item en DynamoDB (tabla: ${tableName}): ${error}`);
            return false;
        }
    }

    /**
     * Obtiene un ítem desde la tabla DynamoDB especificada, usando la clave primaria.
     * @param tableName Nombre de la tabla.
     * @param key La clave primaria del ítem.
     * @returns El ítem si existe, o null si no se encuentra.
     */
    async getItem(tableName: string, key: Record<string, any>): Promise<Record<string, any> | null> {
        try {
            const command = new GetItemCommand({
                TableName: tableName,
                Key: key,
            });
            const response = await this.client.send(command);
            return response.Item || null;
        } catch (error) {
            this.logger.error(`Error al obtener item de DynamoDB (tabla: ${tableName}): ${error}`);
            return null;
        }
    }
}
