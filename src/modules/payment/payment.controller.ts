import { Controller, Post, Body, UsePipes, HttpStatus } from '@nestjs/common';
import { PaymentValidationPipe } from './pipes/payment-validation.pipe';
import { PaymentService } from './payment.service';
import { IPayment } from 'src/modules/payment/interfaces/payment.interface';
import { OutputMessageSuccess } from 'src/common/interfaces/output-message-success';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    @UsePipes(PaymentValidationPipe)
    async createPayment(@Body() payment: IPayment) {
        await this.paymentService.createPayment(payment);
        return new OutputMessageSuccess(
            HttpStatus.CREATED,
            '0000', // Puedes definir el código que desees para indicar éxito
            'Pago creado exitosamente',
            { transaction_id: payment.transaction_id }
        );
    }
}
