import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateIngredientDto {
	@ApiProperty({ description: 'Название ингредиента' })
	@IsNotEmpty({ message: 'Название ингредиента обязателен' })
	name: string

	@ApiPropertyOptional({ description: 'Содержит глютен', default: false })
	@IsOptional()
	@IsBoolean()
	containsGluten?: boolean

	@ApiPropertyOptional({ description: 'Содержит молочные продукты', default: false })
	@IsOptional()
	@IsBoolean()
	containsDairy?: boolean

	@ApiPropertyOptional({ description: 'Содержит орехи', default: false })
	@IsOptional()
	@IsBoolean()
	containsNuts?: boolean

	@ApiPropertyOptional({ description: 'Содержит сою', default: false })
	@IsOptional()
	@IsBoolean()
	containsSoy?: boolean

	@ApiPropertyOptional({ description: 'Содержит яйца', default: false })
	@IsOptional()
	@IsBoolean()
	containsEggs?: boolean
}
