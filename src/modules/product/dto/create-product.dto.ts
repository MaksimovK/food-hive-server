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

export class ProductIngredientDto {
	@IsUUID('4', { message: 'Неверный формат ID ингредиента' })
	@IsNotEmpty({ message: 'ID ингредиента обязателен' })
	ingredientId: string

	@IsOptional()
	@IsNumber({}, { message: 'Количество должно быть числом' })
	@Min(0, { message: 'Количество должно быть неотрицательным' })
	amount?: number

	@IsOptional()
	@IsString()
	unit?: string
}

export class CreateProductDto {
	@IsNotEmpty({ message: 'Название продукта обязательно' })
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	description?: string

	@IsNotEmpty({ message: 'Изображение обязательно' })
	@IsString()
	image: string

	@IsNotEmpty({ message: 'Цена обязательна' })
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена должна быть неотрицательной' })
	price: number

	@IsNotEmpty({ message: 'Калорийность обязательна' })
	@IsNumber({}, { message: 'Калорийность должна быть числом' })
	@Min(0, { message: 'Калорийность должна быть неотрицательной' })
	caloriesPer100g: number

	@IsNotEmpty({ message: 'Белки обязательны' })
	@IsNumber({}, { message: 'Белки должны быть числом' })
	@Min(0, { message: 'Белки должны быть неотрицательными' })
	proteinPer100g: number

	@IsNotEmpty({ message: 'Жиры обязательны' })
	@IsNumber({}, { message: 'Жиры должны быть числом' })
	@Min(0, { message: 'Жиры должны быть неотрицательными' })
	fatPer100g: number

	@IsNotEmpty({ message: 'Углеводы обязательны' })
	@IsNumber({}, { message: 'Углеводы должны быть числом' })
	@Min(0, { message: 'Углеводы должны быть неотрицательными' })
	carbsPer100g: number

	@IsNotEmpty({ message: 'Размер порции обязателен' })
	@IsInt({ message: 'Размер порции должен быть целым числом' })
	@IsPositive({ message: 'Размер порции должен быть положительным' })
	servingSize: number

	@IsNotEmpty({ message: 'Категория обязательна' })
	@IsUUID('4', { message: 'Неверный формат ID категории' })
	categoryId: string

	@IsOptional()
	@IsBoolean()
	isActive?: boolean

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductIngredientDto)
	ingredients?: ProductIngredientDto[]
}
