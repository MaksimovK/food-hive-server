import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateIngredientDto {
	@IsNotEmpty({ message: 'Название ингредиента обязателен' })
	name: string

	@IsOptional()
	@IsBoolean()
	containsGluten?: boolean

	@IsOptional()
	@IsBoolean()
	containsDairy?: boolean

	@IsOptional()
	@IsBoolean()
	containsNuts?: boolean

	@IsOptional()
	@IsBoolean()
	containsSoy?: boolean

	@IsOptional()
	@IsBoolean()
	containsEggs?: boolean
}
