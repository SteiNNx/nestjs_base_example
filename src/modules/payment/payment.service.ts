import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { SignClient } from './clients/sign.client';
import { IPayment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/payment.dto';

/**
 * Servicio encargado de la lógica de negocio relacionada con los pagos.
 */
@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);

    /**
     * Crea una instancia de PaymentService.
     * @param paymentRepository Repositorio para interactuar con la base de datos de pagos.
     * @param signClient Cliente encargado de la firma de pagos.
     */
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly signClient: SignClient,
    ) { }

    /**
     * Obtiene un pago existente por su ID de transacción.
     * @param transactionId ID de la transacción del pago a obtener.
     * @returns Promesa que resuelve con el pago encontrado o null si no existe.
     */
    async getPayment(transactionId: string): Promise<IPayment | null> {
        return this.paymentRepository.getPayment(transactionId);
    }

    /**
     * Crea un nuevo pago.
     * @param createPaymentDto DTO que contiene los detalles del pago a crear.
     * @returns Promesa que resuelve con el pago creado.
     */
    async createPayment(createPaymentDto: CreatePaymentDto): Promise<IPayment> {
        return this.paymentRepository.createPayment(createPaymentDto);
    }

    /**
     * Firma los datos de un pago.
     * @param payment Objeto de pago a firmar.
     * @returns Promesa que resuelve con los datos firmados.
     */
    async signPayment(payment: IPayment): Promise<Buffer> {
        const signedData = await this.signClient.signPayment(payment);
        return signedData;
    }

    /**
     * Actualiza el estado de un pago.
     * @param transactionId ID de la transacción del pago a actualizar.
     * @param status Nuevo estado del pago.
     * @returns Promesa que resuelve cuando la actualización es completa.
     */
    async updatePaymentStatus(transactionId: string, status: string): Promise<void> {
        await this.paymentRepository.updatePaymentStatus(transactionId, status);
    }

    /**
     * Actualiza el estado y los datos firmados de un pago.
     * @param transactionId ID de la transacción del pago a actualizar.
     * @param status Nuevo estado del pago.
     * @param signedData Datos firmados del pago.
     * @returns Promesa que resuelve cuando la actualización es completa.
     */
    async updatePaymentStatusAndSignedData(transactionId: string, status: string, signedData: string): Promise<void> {
        await this.paymentRepository.updatePaymentStatusAndSignedData(transactionId, status, signedData);
    }
}
