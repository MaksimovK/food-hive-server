import { Type } from 'class-transformer'
import {
	IsArray,
	IsBoolean,
	IsInt,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	IsUUID,
	Min,
	ValidateNested
} from 'class-validator'
import { ProductIngredientDto } from './create-product.dto'

export class UpdateProductDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	image?: string

	@IsOptional()
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена должна быть неотрицательной' })
	price?: number

	@IsOptional()
	@IsNumber({}, { message: 'Калорийность должна быть числом' })
	@Min(0, { message: 'Калорийность должна быть неотрицательной' })
	caloriesPer100g?: number

	@IsOptional()
	@IsNumber({}, { message: 'Белки должны быть числом' })
	@Min(0, { message: 'Белки должны быть неотрицательными' })
	proteinPer100g?: number

	@IsOptional()
	@IsNumber({}, { message: 'Жиры должны быть числом' })
	@Min(0, { message: 'Жиры должны быть неотрицательными' })
	fatPer100g?: number

	@IsOptional()
	@IsNumber({}, { message: 'Углеводы должны быть числом' })
	@Min(0, { message: 'Углеводы должны быть неотрицательными' })
	carbsPer100g?: number

	@IsOptional()
	@IsInt({ message: 'Размер порции должен быть целым числом' })
	@IsPositive({ message: 'Размер порции должен быть положительным' })
	servingSize?: number

	@IsOptional()
	@IsUUID('4', { message: 'Неверный формат ID категории' })
	categoryId?: string

	@IsOptional()
	@IsBoolean()
	isActive?: boolean

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductIngredientDto)
	ingredients?: ProductIngredientDto[]
}
