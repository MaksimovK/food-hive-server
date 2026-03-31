import {
	NAME_REGEX,
	PASSWORD_REGEX,
	PHONE_REGEX
} from '@/common/constants/validation.constants'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
	@ApiProperty({
		description: 'Email адрес пользователя',
		example: 'user@example.com'
	})
	@IsEmail({}, { message: 'Некорректный формат email' })
	@IsNotEmpty({ message: 'Email обязателен' })
	email: string

	@ApiProperty({
		description: 'Пароль пользователя (минимум 8 символов)',
		example: 'Password123!'
	})
	@MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
	@Matches(PASSWORD_REGEX, {
		message:
			'Пароль должен содержать: заглавные буквы, строчные буквы, цифры и спецсимволы (@$!%*?&)'
	})
	password: string

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Иван Иванов'
	})
	@IsString()
	@MinLength(2, { message: 'Имя должно быть не менее 2 символов' })
	@Matches(NAME_REGEX, {
		message: 'Имя может содержать только буквы, пробелы и дефисы'
	})
	name: string

	@ApiProperty({
		description: 'Номер телефона',
		example: '+79991234567'
	})
	@IsString()
	@Matches(PHONE_REGEX, {
		message: 'Неверный формат телефона. Пример: +79991234567'
	})
	phone: string

	@ApiProperty({
		description: 'Дата рождения в формате dd-mm-yyyy',
		example: '15-05-1990'
	})
	@IsNotEmpty({ message: 'Дата рождения обязательна' })
	@IsString()
	@Matches(/^\d{2}-\d{2}-\d{4}$/, {
		message:
			'Дата рождения должна быть в формате dd-mm-yyyy (например, 15-05-1990)'
	})
	dateOfBirth: string
}
