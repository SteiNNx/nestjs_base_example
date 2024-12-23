// src/modules/auth/factories/jwt-config.factory.ts

import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';

// Importa tu excepción personalizada
import { TechnicalError } from 'src/common/exceptions/technical.exception';

/**
 * Función factory que construye la configuración JWT
 * a partir de las variables de entorno y validaciones necesarias.
 */
export const createJwtConfig = (configService: ConfigService): JwtModuleOptions => {
    const privateKey = configService.get<string>('jwt.privateKey');
    const publicKey = configService.get<string>('jwt.publicKey');
    const algorithm = configService.get<string>('jwt.algorithms') || 'RS256';
    const expiresIn = configService.get<string>('jwt.expiresIn') || '3600s';

    const validAlgorithms: Algorithm[] = [
        'RS256',
        'HS256',
        'HS384',
        'HS512',
        'RS384',
        'RS512',
    ];

    if (!validAlgorithms.includes(algorithm as Algorithm)) {
        // Lanza un TechnicalError (o la excepción que prefieras)
        throw new TechnicalError(
            'TECH.JWT.001',                            // code interno
            `Algoritmo JWT no válido: ${algorithm}. Algoritmos permitidos: ${validAlgorithms.join(', ')}`,
            500,                                       // status HTTP
        );
    }

    return {
        privateKey,
        signOptions: {
            algorithm: algorithm as Algorithm,
            expiresIn,
        },
    };
};
