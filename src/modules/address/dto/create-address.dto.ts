import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateAddressDto {
	@IsNotEmpty({ message: 'Улица обязательна' })
	@IsString()
	street: string

	@IsNotEmpty({ message: 'Дом обязателен' })
	@IsString()
	house: string

	@IsOptional()
	@IsString()
	apartment?: string

	@IsOptional()
	@IsString()
	entrance?: string

	@IsOptional()
	@IsString()
	floor?: string

	@IsOptional()
	@IsString()
	comment?: string

	@IsOptional()
	@IsBoolean()
	isDefault?: boolean

	@IsOptional()
	@IsString()
	label?: string
}
