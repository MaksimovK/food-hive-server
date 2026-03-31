import {
	IsArray,
	IsInt,
	IsUUID,
	Min,
	ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CartItemDto {
	@ApiProperty({ description: 'ID продукта' })
	@IsUUID()
	productId: string

	@ApiProperty({ description: 'Количество', example: 2 })
	@IsInt()
	@Min(1)
	quantity: number
}

export class AddToCartDto {
	@ApiProperty({ description: 'ID продукта' })
	@IsUUID()
	productId: string

	@ApiProperty({ description: 'Количество', example: 2, default: 1 })
	@IsInt()
	@Min(1)
	quantity: number
}

export class RemoveFromCartDto {
	@ApiProperty({ description: 'ID продукта' })
	@IsUUID()
	productId: string

	@ApiProperty({ description: 'Количество для удаления', example: 1, default: 1 })
	@IsInt()
	@Min(1)
	quantity: number
}

export class BulkCartOperationDto {
	@ApiProperty({
		description: 'Список товаров',
		type: [CartItemDto]
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CartItemDto)
	items: CartItemDto[]
}
