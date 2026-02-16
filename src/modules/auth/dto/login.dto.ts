import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class LoginDto {
	@IsEmail({}, { message: 'Некорректный формат email' })
	@IsNotEmpty({ message: 'Email обязателен' })
	email: string

	@IsNotEmpty({ message: 'Пароль обязателен' })
	@MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
	password: string
}
