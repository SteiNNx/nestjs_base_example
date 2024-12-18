// src/core/monitoreo.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitoreoService {
    /**
     * Método que en el futuro enviará información de monitoreo a un destino externo.
     * Actualmente, este método no realiza ninguna acción.
     */
    send(payload: any): void {
        // En el futuro, aquí se implementará la lógica para enviar datos de monitoreo.
        // Por el momento, no hace nada.
    }
}
