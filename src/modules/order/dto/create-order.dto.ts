import { PaymentMethod } from '@/database/prisma/generated/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateOrderDto {
	@IsString()
	@IsNotEmpty()
	addressId: string

	@IsEnum(PaymentMethod)
	paymentMethod: PaymentMethod

	@IsString()
	@IsOptional()
	orderComment?: string
}
