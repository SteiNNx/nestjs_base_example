// src/common/factories/jwt-load-keys.factory.ts

import * as fs from 'fs';
import * as path from 'path';
import { TechnicalError } from 'src/common/exceptions/technical.exception';

export interface JwtKeysResult {
    privateKey: string;
    publicKey: string;
}

/**
 * Carga y valida las claves JWT leyendo las rutas de .env.
 */
export function loadJwtKeys(): JwtKeysResult {
    const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
    const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

    if (!privateKeyPath || !publicKeyPath) {
        throw new TechnicalError(
            'TECH.JWT.001',
            'Las rutas de las claves PEM no están definidas en las variables de entorno.',
            500,
        );
    }

    const resolvedPrivateKeyPath = path.resolve(process.cwd(), privateKeyPath);
    const resolvedPublicKeyPath = path.resolve(process.cwd(), publicKeyPath);

    if (!fs.existsSync(resolvedPrivateKeyPath)) {
        throw new TechnicalError(
            'TECH.JWT.002',
            `La clave privada no existe en la ruta: ${resolvedPrivateKeyPath}`,
            500,
        );
    }

    if (!fs.existsSync(resolvedPublicKeyPath)) {
        throw new TechnicalError(
            'TECH.JWT.003',
            `La clave pública no existe en la ruta: ${resolvedPublicKeyPath}`,
            500,
        );
    }

    const privateKey = fs.readFileSync(resolvedPrivateKeyPath, 'utf8');
    const publicKey = fs.readFileSync(resolvedPublicKeyPath, 'utf8');

    return { privateKey, publicKey };
}
