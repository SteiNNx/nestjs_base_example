// src/modules/auth/repositories/auth.repository.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBService } from 'src/common/db/dynamodb.client';
import { IUser } from '../interfaces/auth.interface';

@Injectable()
export class AuthRepository {
    private readonly logger = new Logger(AuthRepository.name);
    private readonly tableName: string;

    constructor(
        private readonly dynamoDBService: DynamoDBService,
        private readonly configService: ConfigService,
    ) {
        // Obtenemos el nombre de la tabla 'users' desde la configuración
        this.tableName = this.configService.get<string>('dynamoDB.tables.users') || 'users';
    }

    /**
     * Obtiene un usuario por su username.
     */
    async getUserByUsername(username: string): Promise<IUser | null> {
        try {
            const key = { username: { S: username } };
            const item = await this.dynamoDBService.getItem(this.tableName, key);
            return item ? this.mapDynamoDBItemToUser(item) : null;
        } catch (error) {
            this.logger.error(`Error al obtener usuario: ${error}`);
            return null;
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos DynamoDB.
     */
    async createUser(user: IUser): Promise<boolean> {
        const item = {
            username: { S: user.username },
            password: { S: user.password },
            userId: { N: user.userId.toString() },
            role: { S: user.role },
            created_at: { S: user.created_at },
        };

        const success = await this.dynamoDBService.putItem(this.tableName, item);
        if (!success) {
            this.logger.error(`No se pudo crear el usuario: ${user.username}`);
        }
        return success;
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
