// src/modules/payment/clients/sign.client.ts

import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { HttpClientService } from 'src/core/http-client.service';
import { ConfigService } from '@nestjs/config';
import { IPayment } from 'src/modules/payment/interfaces/payment.interface';
import { AxiosResponse } from 'axios';

@Injectable()
export class SignClient {
    private readonly logger = new Logger(SignClient.name);
    private readonly url_endpoint: string;

    constructor(
        private readonly httpClientService: HttpClientService,
        private readonly configService: ConfigService,
    ) {
        this.url_endpoint = this.configService.get<string>('SIGN_SERVICE_URL');
        if (!this.url_endpoint) {
            throw new HttpException('URL del servicio de firma no configurada', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Envía los datos de pago al servicio de firma y retorna el archivo firmado.
     * @param payment Datos de pago a firmar.
     * @returns Archivo firmado en formato XLS o XML.
     */
    async signPayment(payment: IPayment): Promise<Buffer> {
        try {
            this.logger.log('Enviando datos de pago al servicio de firma');
            const response: AxiosResponse<Buffer> = await this.httpClientService.post<Buffer>(
                this.url_endpoint,
                payment,
                {
                    responseType: 'arraybuffer', // Para manejar archivos binarios
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/octet-stream', // O el tipo que retorne tu servicio
                    },
                },
            );

            if (response.status !== HttpStatus.OK) {
                this.logger.error(`Error al firmar el pago: ${response.statusText}`);
                throw new HttpException('Error al firmar el pago', response.status);
            }

            this.logger.log('Pago firmado exitosamente');
            return response.data;
        } catch (error) {
            this.logger.error(`Excepción al firmar el pago: ${error.message}`);
            throw new HttpException('Error al comunicarse con el servicio de firma', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
