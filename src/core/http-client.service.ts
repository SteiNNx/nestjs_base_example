// src/core/httpClient.service.ts

import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Servicio encargado de manejar las solicitudes HTTP utilizando el HttpService de NestJS.
 */
@Injectable()
export class HttpClientService {
    private readonly logger = new Logger(HttpClientService.name);

    /**
     * Crea una instancia de HttpClientService.
     * @param httpService Servicio proporcionado por NestJS para realizar solicitudes HTTP.
     * @param configService Servicio para acceder a las variables de configuración.
     */
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * Realiza una solicitud GET.
     * @param endpoint URL completa del endpoint.
     * @param config Configuraciones adicionales para la solicitud.
     * @returns Promesa con la respuesta de la solicitud.
     */
    async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        this.logger.log(`GET Request to ${endpoint} with config: ${JSON.stringify(config)}`);
        return firstValueFrom(
            this.httpService.get<T>(endpoint, config).pipe(
                map((response: AxiosResponse<T>) => response.data),
                catchError(this.handleAxiosError.bind(this)),
            ),
        );
    }

    /**
     * Realiza una solicitud POST.
     * @param endpoint URL completa del endpoint.
     * @param data Cuerpo de la solicitud.
     * @param config Configuraciones adicionales para la solicitud.
     * @returns Promesa con la respuesta de la solicitud.
     */
    async post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        this.logger.log(`POST Request to ${endpoint} with data: ${JSON.stringify(data)} and config: ${JSON.stringify(config)}`);
        return firstValueFrom(
            this.httpService.post<T>(endpoint, data, config).pipe(
                map((response: AxiosResponse<T>) => response.data),
                catchError(this.handleAxiosError.bind(this)),
            ),
        );
    }

    /**
     * Realiza una solicitud PUT.
     * @param endpoint URL completa del endpoint.
     * @param data Cuerpo de la solicitud.
     * @param config Configuraciones adicionales para la solicitud.
     * @returns Promesa con la respuesta de la solicitud.
     */
    async put<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        this.logger.log(`PUT Request to ${endpoint} with data: ${JSON.stringify(data)} and config: ${JSON.stringify(config)}`);
        return firstValueFrom(
            this.httpService.put<T>(endpoint, data, config).pipe(
                map((response: AxiosResponse<T>) => response.data),
                catchError(this.handleAxiosError.bind(this)),
            ),
        );
    }

    /**
     * Realiza una solicitud DELETE.
     * @param endpoint URL completa del endpoint.
     * @param config Configuraciones adicionales para la solicitud.
     * @returns Promesa con la respuesta de la solicitud.
     */
    async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        this.logger.log(`DELETE Request to ${endpoint} with config: ${JSON.stringify(config)}`);
        return firstValueFrom(
            this.httpService.delete<T>(endpoint, config).pipe(
                map((response: AxiosResponse<T>) => response.data),
                catchError(this.handleAxiosError.bind(this)),
            ),
        );
    }

    /**
     * Maneja los errores de Axios y los transforma en excepciones personalizadas.
     * @param error Objeto de error recibido de Axios.
     * @returns Observable que rechaza con la excepción personalizada.
     */
    private handleAxiosError(error: any): Observable<never> {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            this.logger.error(
                `HTTP Error Response: ${error.response.status} - ${error.response.statusText}`,
                JSON.stringify(error.response.data),
            );
            return throwError(() => new HttpException(error.response.data, error.response.status));
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            this.logger.error('No response received from the server.', JSON.stringify(error.request));
            return throwError(() => new HttpException('No response received from the server.', HttpStatus.GATEWAY_TIMEOUT));
        } else {
            // Algo pasó al configurar la solicitud que desencadenó un error
            this.logger.error(`Error in setting up the request: ${error.message}`, error.stack);
            return throwError(() => new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
}
