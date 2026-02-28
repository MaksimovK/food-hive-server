import {
	NAME_REGEX,
	PASSWORD_REGEX,
	PHONE_REGEX
} from '@/common/constants/validation.constants'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MinLength
} from 'class-validator'

export class RegisterDto {
	@IsEmail({}, { message: 'Некорректный формат email' })
	@IsNotEmpty({ message: 'Email обязателен' })
	email: string

	@MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
	@Matches(PASSWORD_REGEX, {
		message:
			'Пароль должен содержать: заглавные буквы, строчные буквы, цифры и спецсимволы (@$!%*?&)'
	})
	password: string

	@IsString()
	@MinLength(2, { message: 'Имя должно быть не менее 2 символов' })
	@Matches(NAME_REGEX, {
		message: 'Имя может содержать только буквы, пробелы и дефисы'
	})
	name: string

	@IsOptional()
	@IsString()
	@Matches(PHONE_REGEX, {
		message: 'Неверный формат телефона. Пример: +79991234567'
	})
	phone?: string
}
