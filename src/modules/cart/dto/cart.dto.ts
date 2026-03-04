import { IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CartItemDto {
	@IsUUID()
	productId: string

	@IsInt()
	@Min(1)
	quantity: number
}

export class AddToCartDto {
	@IsUUID()
	productId: string

	@IsInt()
	@Min(1)
	quantity: number
}

export class RemoveFromCartDto {
	@IsUUID()
	productId: string

	@IsInt()
	@Min(1)
	quantity: number
}

export class BulkCartOperationDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CartItemDto)
	items: CartItemDto[]
}
