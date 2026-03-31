import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
	@ApiProperty({
		description: 'Email адрес пользователя',
		example: 'user@example.com'
	})
	@IsEmail({}, { message: 'Некорректный формат email' })
	@IsNotEmpty({ message: 'Email обязателен' })
	email: string

	@ApiProperty({
		description: 'Пароль пользователя',
		example: 'Password123!'
	})
	@IsNotEmpty({ message: 'Пароль обязателен' })
	@MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
	password: string
}
