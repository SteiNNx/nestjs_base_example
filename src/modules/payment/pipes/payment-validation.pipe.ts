import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Payment } from 'src/modules/payment/interfaces/payment.interface';

@Injectable()
export class PaymentValidationPipe implements PipeTransform {
    async transform(value: any): Promise<Payment> {
        const transformed = plainToInstance(Payment, value);
        const errors = await validate(transformed);

        if (errors.length > 0) {
            throw new BadRequestException(errors.map(err => err.constraints));
        }

        return transformed;
    }
}
