import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class UpdateCategoryDto {
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
	@IsInt()
	@Min(0, { message: 'Порядковый номер должен быть неотрицательным' })
	order?: number

	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}
