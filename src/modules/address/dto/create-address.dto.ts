import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAddressDto {
	@ApiProperty({ description: 'Улица' })
	@IsNotEmpty({ message: 'Улица обязательна' })
	@IsString()
	street: string

	@ApiProperty({ description: 'Дом' })
	@IsNotEmpty({ message: 'Дом обязателен' })
	@IsString()
	house: string

	@ApiPropertyOptional({ description: 'Квартира' })
	@IsOptional()
	@IsString()
	apartment?: string

	@ApiPropertyOptional({ description: 'Подъезд' })
	@IsOptional()
	@IsString()
	entrance?: string

	@ApiPropertyOptional({ description: 'Этаж' })
	@IsOptional()
	@IsString()
	floor?: string

	@ApiPropertyOptional({ description: 'Комментарий к адресу' })
	@IsOptional()
	@IsString()
	comment?: string

	@ApiPropertyOptional({ description: 'Адрес по умолчанию', default: false })
	@IsOptional()
	@IsBoolean()
	isDefault?: boolean

	@ApiPropertyOptional({ description: 'Метка адреса (например, "Дом", "Работа")' })
	@IsOptional()
	@IsString()
	label?: string
}
