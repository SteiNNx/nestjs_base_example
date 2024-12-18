// src/common/decorators/headers-metadata.decorator.ts
import { SetMetadata } from '@nestjs/common';

export interface HeadersMetadataOptions {
    funcionalidad: string; // Clave de configuración para 'funcionalidad'
    etapa: string;         // Clave de configuración para 'etapa'
    operacion: string;     // Clave de configuración para 'operacion'
}

export const HeadersMetadata = (metadata: HeadersMetadataOptions) =>
    SetMetadata('headersMetadata', metadata);
