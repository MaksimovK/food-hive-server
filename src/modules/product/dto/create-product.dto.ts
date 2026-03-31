import { Type } from 'class-transformer'
import {
	IsArray,
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	IsUUID,
	Min,
	ValidateNested
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ProductIngredientDto {
	@ApiProperty({ description: 'ID ингредиента' })
	@IsUUID('4', { message: 'Неверный формат ID ингредиента' })
	@IsNotEmpty({ message: 'ID ингредиента обязателен' })
	ingredientId: string

	@ApiPropertyOptional({ description: 'Количество', example: 10 })
	@IsOptional()
	@IsNumber({}, { message: 'Количество должно быть числом' })
	@Min(0, { message: 'Количество должно быть неотрицательным' })
	amount?: number

	@ApiPropertyOptional({ description: 'Единица измерения', example: 'г' })
	@IsOptional()
	@IsString()
	unit?: string
}

export class CreateProductDto {
	@ApiProperty({ description: 'Название продукта', example: 'Боржимо' })
	@IsNotEmpty({ message: 'Название продукта обязательно' })
	@IsString()
	name: string

	@ApiPropertyOptional({ description: 'Описание продукта' })
	@IsOptional()
	@IsString()
	description?: string

	@ApiProperty({ description: 'URL изображения', example: '/images/product.png' })
	@IsNotEmpty({ message: 'Изображение обязательно' })
	@IsString()
	image: string

	@ApiProperty({ description: 'Цена', example: 199.99 })
	@IsNotEmpty({ message: 'Цена обязательна' })
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена должна быть неотрицательной' })
	price: number

	@ApiProperty({ description: 'Калорийность на 100г', example: 45.5 })
	@IsNotEmpty({ message: 'Калорийность обязательна' })
	@IsNumber({}, { message: 'Калорийность должна быть числом' })
	@Min(0, { message: 'Калорийность должна быть неотрицательной' })
	caloriesPer100g: number

	@ApiProperty({ description: 'Белки на 100г', example: 1.2 })
	@IsNotEmpty({ message: 'Белки обязательны' })
	@IsNumber({}, { message: 'Белки должны быть числом' })
	@Min(0, { message: 'Белки должны быть неотрицательными' })
	proteinPer100g: number

	@ApiProperty({ description: 'Жиры на 100г', example: 0.5 })
	@IsNotEmpty({ message: 'Жиры обязательны' })
	@IsNumber({}, { message: 'Жиры должны быть числом' })
	@Min(0, { message: 'Жиры должны быть неотрицательными' })
	fatPer100g: number

	@ApiProperty({ description: 'Углеводы на 100г', example: 10.3 })
	@IsNotEmpty({ message: 'Углеводы обязательны' })
	@IsNumber({}, { message: 'Углеводы должны быть числом' })
	@Min(0, { message: 'Углеводы должны быть неотрицательными' })
	carbsPer100g: number

	@ApiProperty({ description: 'Размер порции в граммах', example: 500 })
	@IsNotEmpty({ message: 'Размер порции обязателен' })
	@IsInt({ message: 'Размер порции должен быть целым числом' })
	@IsPositive({ message: 'Размер порции должен быть положительным' })
	servingSize: number

	@ApiPropertyOptional({ description: 'Единица измерения', example: 'г' })
	@IsOptional()
	@IsString()
	unit?: string

	@ApiProperty({ description: 'ID категории' })
	@IsNotEmpty({ message: 'Категория обязательна' })
	@IsUUID('4', { message: 'Неверный формат ID категории' })
	categoryId: string

	@ApiPropertyOptional({ description: 'Активен ли продукт', default: true })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean

	@ApiPropertyOptional({
		description: 'Ингредиенты продукта',
		type: [ProductIngredientDto]
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductIngredientDto)
	ingredients?: ProductIngredientDto[]
}
