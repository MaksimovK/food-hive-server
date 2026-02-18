import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class UpdateBannerDto {
	@IsOptional()
	@IsString()
	image?: string

	@IsOptional()
	@IsString()
	title?: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	link?: string

	@IsOptional()
	@IsInt()
	@Min(0, { message: 'Порядковый номер должен быть неотрицательным' })
	order?: number

	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}
