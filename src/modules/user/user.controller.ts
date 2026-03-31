import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
	constructor(private usersService: UserService) {}

	@Get('profile')
	@ApiOperation({ summary: 'Получить профиль пользователя' })
	@ApiResponse({
		status: 200,
		description: 'Профиль получен успешно',
		schema: {
			example: {
				id: 'uuid',
				email: 'user@example.com',
				name: 'Иван Иванов',
				phone: '+79991234567',
				avatar: '/avatars/avatar_uuid_123.png',
				dateOfBirth: '1990-05-15T00:00:00.000Z',
				role: 'USER',
				createdAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@HttpCode(HttpStatus.OK)
	getProfile(@CurrentUser('id') userId: string) {
		return this.usersService.getProfile(userId)
	}

	@Patch('profile')
	@ApiOperation({ summary: 'Обновить профиль пользователя' })
	@ApiBody({ type: UpdateProfileDto })
	@ApiResponse({
		status: 200,
		description: 'Профиль обновлён',
		schema: {
			example: {
				id: 'uuid',
				email: 'user@example.com',
				name: 'Иван Петров',
				phone: '+79991234567',
				avatar: '/avatars/avatar_uuid_123.png',
				dateOfBirth: '1990-05-15T00:00:00.000Z',
				role: 'USER',
				createdAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Для смены пароля требуется текущий пароль' })
	@ApiResponse({ status: 401, description: 'Неверный текущий пароль' })
	@ApiResponse({ status: 404, description: 'Пользователь не найден' })
	@ApiResponse({ status: 409, description: 'Телефон уже используется' })
	@HttpCode(HttpStatus.OK)
	updateProfile(
		@CurrentUser('id') userId: string,
		@Body() dto: UpdateProfileDto
	) {
		return this.usersService.updateProfile(userId, dto)
	}

	@Patch('profile/avatar')
	@ApiOperation({ summary: 'Загрузить аватар пользователя' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				avatar: {
					type: 'string',
					format: 'binary',
					description: 'Файл аватара (JPEG, PNG, WEBP, макс. 5MB)'
				}
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'Аватар загружён',
		schema: {
			example: {
				id: 'uuid',
				email: 'user@example.com',
				name: 'Иван Иванов',
				phone: '+79991234567',
				avatar: '/avatars/avatar_uuid_1234567890.png',
				dateOfBirth: '1990-05-15T00:00:00.000Z',
				role: 'USER',
				createdAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Неверный формат файла или размер' })
	@ApiResponse({ status: 404, description: 'Пользователь не найден' })
	@UseInterceptors(
		FileInterceptor('avatar', {
			limits: {
				fileSize: 5 * 1024 * 1024
			}
		})
	)
	@HttpCode(HttpStatus.OK)
	async uploadAvatar(
		@CurrentUser('id') userId: string,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!file) {
			return this.usersService.removeAvatar(userId)
		}

		return this.usersService.updateAvatar(userId, file)
	}

	@Delete('profile/avatar')
	@ApiOperation({ summary: 'Удалить аватар пользователя' })
	@ApiResponse({
		status: 200,
		description: 'Аватар удалён',
		schema: {
			example: {
				id: 'uuid',
				email: 'user@example.com',
				name: 'Иван Иванов',
				phone: '+79991234567',
				avatar: null,
				dateOfBirth: '1990-05-15T00:00:00.000Z',
				role: 'USER',
				createdAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@ApiResponse({ status: 404, description: 'Пользователь не найден' })
	@HttpCode(HttpStatus.OK)
	async removeAvatar(@CurrentUser('id') userId: string) {
		return this.usersService.removeAvatar(userId)
	}
}
