// src/modules/auth/repositories/auth.repository.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBService } from 'src/common/db/dynamodb.client';
import { IUser } from '../interfaces/auth.interface';

// Importamos excepciones personalizadas
import { TechnicalError } from 'src/common/exceptions/technical.exception';
import { LoggerService } from 'src/core/logger.service';

@Injectable()
export class AuthRepository {
    private readonly tableName: string;

    constructor(
        private readonly dynamoDBService: DynamoDBService,
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
    ) {
        // Obtenemos el nombre de la tabla 'users' desde la configuración
        this.tableName = this.configService.get<string>('dynamoDB.tables.users') || 'users';
    }

    /**
     * Obtiene un usuario por su username.
     */
    async getUserByUsername(username: string): Promise<IUser | null> {
        this.logger.debug(`Obteniendo usuario desde DynamoDB: ${username}`);
        try {
            const key = { username: { S: username } };
            const item = await this.dynamoDBService.getItem(this.tableName, key);
            this.logger.debug(`Usuario obtenido desde DynamoDB: ${username}`);
            return item ? this.mapDynamoDBItemToUser(item) : null;
        } catch (error) {
            this.logger.error(`Error al obtener usuario: ${error.message}`, { error });
            // Lanzamos un error técnico que envuelve el error original
            throw new TechnicalError(
                'TECH.001',
                `Error interno al consultar la tabla '${this.tableName}'.`,
                500,
                error,
            );
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos DynamoDB.
     */
    async createUser(user: IUser): Promise<boolean> {
        this.logger.debug(`Creando usuario en DynamoDB: ${user.username}`);
        try {
            const item = {
                username: { S: user.username },
                password: { S: user.password },
                userId: { N: user.userId.toString() },
                role: { S: user.role },
                created_at: { S: user.created_at },
            };

            const success = await this.dynamoDBService.putItem(this.tableName, item);
            if (!success) {
                // Si `putItem` devolvió false, consideramos que hubo un problema técnico
                this.logger.error(`No se pudo crear el usuario: ${user.username}`);
                throw new TechnicalError(
                    'TECH.002',
                    `No se pudo crear el usuario: ${user.username}`,
                    500,
                );
            }

            this.logger.debug(`Usuario creado exitosamente: ${user.username}`);
            return true;
        } catch (error) {
            this.logger.error(`Error al crear usuario: ${error.message}`, { error });
            throw new TechnicalError(
                'TECH.003',
                `Error interno al insertar en la tabla '${this.tableName}'.`,
                500,
                error,
            );
        }
    }

    /**
    * Obtiene un usuario por su ID.
    */
    async getUserById(userId: number): Promise<IUser | null> {
        this.logger.debug(`Obteniendo usuario por ID desde DynamoDB: ${userId}`);
        try {
            const key = { userId: { N: userId.toString() } };
            const item = await this.dynamoDBService.getItem(this.tableName, key);
            this.logger.debug(`Usuario por ID obtenido desde DynamoDB: ${userId}`);
            return item ? this.mapDynamoDBItemToUser(item) : null;
        } catch (error) {
            this.logger.error(`Error al obtener usuario por ID: ${error.message}`, { error });
            throw new TechnicalError(
                'TECH.008',
                `Error interno al consultar la tabla '${this.tableName}' por ID.`,
                500,
                error,
            );
        }
    }

    private mapDynamoDBItemToUser(item: Record<string, any>): IUser {
        return {
            username: item.username.S,
            password: item.password.S,
            userId: parseInt(item.userId.N, 10),
            role: item.role.S,
            created_at: item.created_at.S,
        };
    }
}
