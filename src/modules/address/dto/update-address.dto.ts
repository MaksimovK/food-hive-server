import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateAddressDto {
	@IsOptional()
	@IsString()
	street?: string

	@IsOptional()
	@IsString()
	house?: string

	@IsOptional()
	@IsString()
	apartment?: string

	@IsOptional()
	@IsString()
	entrance?: string

	@IsOptional()
	@IsString()
	floor?: string

	@IsOptional()
	@IsString()
	comment?: string

	@IsOptional()
	@IsBoolean()
	isDefault?: boolean

	@IsOptional()
	@IsString()
	label?: string
}
