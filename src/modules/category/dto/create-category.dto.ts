import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min
} from 'class-validator'

export class CreateCategoryDto {
	@IsNotEmpty({ message: 'Название категории обязательно' })
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	image?: string

	@IsOptional()
	@IsInt()
	@Min(0, { message: 'Порядковый номер должен быть неотрицательным' })
	order?: number

	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}
