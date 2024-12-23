import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { IPayment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/payment.dto';

/**
 * Servicio encargado de la lógica de negocio relacionada con los pagos.
 */
@Injectable()
export class PaymentService {
    /**
     * Crea una instancia de PaymentService.
     * @param paymentRepository Repositorio para interactuar con la base de datos de pagos.
     */
    constructor(private readonly paymentRepository: PaymentRepository) { }

    /**
     * Crea un nuevo pago.
     * @param createPaymentDto DTO que contiene los detalles del pago a crear.
     * @returns Promesa que resuelve con el pago creado.
     */
    async createPayment(createPaymentDto: CreatePaymentDto): Promise<IPayment> {
        // Puedes mapear CreatePaymentDto a IPayment si hay diferencias
        // Aquí asumimos que son compatibles
        return this.paymentRepository.createPayment(createPaymentDto);
    }

    /**
     * Obtiene un pago existente por su ID de transacción.
     * @param transactionId ID de la transacción del pago a obtener.
     * @returns Promesa que resuelve con el pago encontrado o null si no existe.
     */
    async getPayment(transactionId: string): Promise<IPayment | null> {
        return this.paymentRepository.getPayment(transactionId);
    }
}
