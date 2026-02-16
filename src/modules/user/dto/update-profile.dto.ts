import {
	AVATAR_REGEX,
	NAME_REGEX,
	PASSWORD_REGEX,
	PHONE_REGEX
} from '@/common/constants/validation.constants'
import {
	IsNotEmpty,
	IsOptional,
	IsUrl,
	Matches,
	MinLength,
	ValidateIf
} from 'class-validator'

export class UpdateProfileDto {
	@IsOptional()
	@MinLength(2, { message: 'Имя должно быть не менее 2 символов' })
	@Matches(NAME_REGEX, {
		message: 'Имя может содержать только буквы, пробелы и дефисы'
	})
	name?: string | null

	@IsOptional()
	@Matches(PHONE_REGEX, {
		message: 'Неверный формат телефона. Пример: +79991234567'
	})
	phone?: string | null

	@IsOptional()
	@IsUrl({}, { message: 'Неверный формат URL аватара' })
	@Matches(AVATAR_REGEX, {
		message: 'Аватар должен быть изображением (jpg, jpeg, png, gif, webp)'
	})
	avatar?: string | null

	@IsOptional()
	@MinLength(8, {
		message: `Новый пароль должен быть не менее 8 символов`
	})
	@Matches(PASSWORD_REGEX, {
		message:
			'Пароль должен содержать: заглавные буквы, строчные буквы, цифры и спецсимволы (@$!%*?&)'
	})
	newPassword?: string

	@ValidateIf(o => o.newPassword !== undefined)
	@IsNotEmpty({ message: 'Текущий пароль обязателен для смены пароля' })
	currentPassword?: string
}
