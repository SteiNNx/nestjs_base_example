import {
    Controller,
    Post,
    Body,
    UsePipes,
    HttpStatus,
    HttpCode,
    InternalServerErrorException
} from '@nestjs/common';

import { ApiOkResponse, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PaymentService } from './payment.service';
import { LoggerService } from 'src/core/logger.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { OutputMessageSuccess } from 'src/common/interfaces/output-message-success';
import { HeadersMetadata } from 'src/common/decorators/headers-metadata.decorator';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';

/**
 * Controlador encargado de manejar las solicitudes relacionadas con pagos.
 */
@ApiTags('payments')
@Controller('payments')
export class PaymentController {
    /**
     * Crea una instancia de PaymentController.
     * @param paymentService Servicio encargado de la lógica de pagos.
     */
    constructor(
        private readonly paymentService: PaymentService,
        private readonly logger: LoggerService,
    ) { }

    /**
     * Endpoint para crear un nuevo pago.
     * Recibe un objeto con los detalles del pago.
     *
     * @param createPaymentDto Objeto que contiene los detalles del pago.
     * @returns Objeto con el `transaction_id` del pago creado.
     */
    @Post()
    @UsePipes(new ValidationPipe(CreatePaymentDto))
    @HttpCode(HttpStatus.OK)
    @HeadersMetadata({
        funcionalidad: 'endpoints.payment.funcionalidad',
        etapa: 'endpoints.payment.etapa',
        operacion: 'endpoints.payment.operacion',
    })
    @ApiOperation({ summary: 'Crear un nuevo pago' })
    @ApiOkResponse({
        description: 'Pago creado exitosamente',
        type: OutputMessageSuccess,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de pago inválidos',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Error interno al crear el pago',
    })
    async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<OutputMessageSuccess> {
        try {
            // Paso 1: Crear el pago
            const payment = await this.paymentService.createPayment(createPaymentDto);
            this.logger.log(`Pago creado con transaction_id: ${payment.transaction_id}`);

            // Paso 2: Firmar el pago
            const signedDataBuffer = await this.paymentService.signPayment(payment);
            const signedData = signedDataBuffer.toString('base64'); // Convertir a string si es necesario
            this.logger.log(`Pago firmado con transaction_id: ${payment.transaction_id}`);

            // Paso 3: Actualizar el estado y guardar los datos firmados
            await this.paymentService.updatePaymentStatusAndSignedData(
                payment.transaction_id!,
                'success',
                signedData
            );
            this.logger.log(`Estado del pago actualizado a 'success' para transaction_id: ${payment.transaction_id}`);

            // Retornar una respuesta exitosa
            const response = new OutputMessageSuccess(
                HttpStatus.OK,
                '0000',
                'Pago creado y firmado exitosamente',
                { transaction_id: payment.transaction_id }
            );
            return response;
        } catch (error) {
            this.logger.error('Error al procesar el pago', error.stack);

            // Manejar excepciones y retornar una respuesta adecuada
            throw new InternalServerErrorException('Error al procesar el pago');
        }
    }
}
