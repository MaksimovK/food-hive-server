import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateIngredientDto {
	@IsOptional()
	name?: string

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
