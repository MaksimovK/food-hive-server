import { PaymentMethod } from '@/database/prisma/generated/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateOrderDto {
	@ApiProperty({ description: 'ID адреса доставки' })
	@IsString()
	@IsNotEmpty()
	addressId: string

	@ApiProperty({
		description: 'Способ оплаты',
		enum: PaymentMethod,
		example: PaymentMethod.CARD
	})
	@IsEnum(PaymentMethod)
	paymentMethod: PaymentMethod

	@ApiPropertyOptional({ description: 'Комментарий к заказу' })
	@IsString()
	@IsOptional()
	orderComment?: string
}
