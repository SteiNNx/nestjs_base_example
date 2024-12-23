import {
    Controller,
    Post,
    Body,
    UsePipes,
    HttpStatus,
    HttpCode
} from '@nestjs/common';

import { ApiOkResponse, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PaymentService } from './payment.service';
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
    constructor(private readonly paymentService: PaymentService) { }

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
        const payment = await this.paymentService.createPayment(createPaymentDto);
        return new OutputMessageSuccess(
            HttpStatus.OK,
            '0000',
            'Pago creado exitosamente',
            { transaction_id: payment.transaction_id }
        );
    }
}
