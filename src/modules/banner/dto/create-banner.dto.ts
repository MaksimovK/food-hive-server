import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBannerDto {
	@ApiProperty({ description: 'URL изображения баннера' })
	@IsNotEmpty({ message: 'Изображение обязательно' })
	@IsString()
	image: string

	@ApiPropertyOptional({ description: 'Заголовок баннера' })
	@IsOptional()
	@IsString()
	title?: string

	@ApiPropertyOptional({ description: 'Описание баннера' })
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({ description: 'Ссылка для перехода' })
	@IsOptional()
	@IsString()
	link?: string

	@ApiPropertyOptional({ description: 'Порядок отображения', default: 0 })
	@IsOptional()
	@IsInt()
	@Min(0, { message: 'Порядковый номер должен быть неотрицательным' })
	order?: number

	@ApiPropertyOptional({ description: 'Активен ли баннер', default: true })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}
