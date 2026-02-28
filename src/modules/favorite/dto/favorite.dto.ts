import { IsArray, IsNotEmpty, IsUUID } from 'class-validator'

export class ToggleFavoriteDto {
	@IsNotEmpty({ message: 'ID продукта обязателен' })
	@IsUUID('4', { message: 'Неверный формат ID продукта' })
	productId: string
}

export class BulkOperationDto {
	@IsArray({ message: 'Должен быть массив ID' })
	@IsUUID('4', { each: true, message: 'Каждый ID должен быть валидным UUID' })
	productIds: string[]
}
