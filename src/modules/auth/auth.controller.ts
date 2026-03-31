import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import type { Request } from 'express'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	@ApiOperation({ summary: 'Регистрация нового пользователя' })
	@ApiBody({ type: RegisterDto })
	@ApiResponse({
		status: 201,
		description: 'Пользователь успешно зарегистрирован',
		schema: {
			example: {
				user: {
					id: 'uuid',
					email: 'user@example.com',
					name: 'Иван Иванов',
					phone: '+79991234567',
					avatar: null,
					dateOfBirth: '1990-05-15T00:00:00.000Z',
					role: 'USER',
					createdAt: '2024-01-01T00:00:00.000Z'
				},
				accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
				refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
			}
		}
	})
	@ApiResponse({ status: 409, description: 'Пользователь с таким email уже существует' })
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}

	@Post('login')
	@ApiOperation({ summary: 'Вход в систему' })
	@ApiBody({ type: LoginDto })
	@ApiResponse({
		status: 200,
		description: 'Успешный вход',
		schema: {
			example: {
				user: {
					id: 'uuid',
					email: 'user@example.com',
					name: 'Иван Иванов',
					phone: '+79991234567',
					avatar: '/avatars/avatar_uuid_123.png',
					dateOfBirth: '1990-05-15T00:00:00.000Z',
					role: 'USER',
					createdAt: '2024-01-01T00:00:00.000Z'
				},
				accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
				refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
			}
		}
	})
	@ApiResponse({ status: 401, description: 'Неверный email или пароль' })
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto, @Req() req: Request) {
		const deviceId = this.getDeviceId(req)
		const { user, accessToken, refreshToken } = await this.authService.login(
			dto,
			deviceId
		)

		return {
			user,
			accessToken,
			refreshToken
		}
	}

	@Post('refresh')
	@ApiOperation({ summary: 'Обновление access-токена' })
	@ApiBody({
		schema: {
			example: {
				refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'Токены успешно обновлены',
		schema: {
			example: {
				accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
				refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
			}
		}
	})
	@ApiResponse({ status: 401, description: 'Неверный refresh токен' })
	@HttpCode(HttpStatus.OK)
	async refresh(@Body() body: { refreshToken: string }, @Req() req: Request) {
		const { refreshToken } = body
		if (!refreshToken)
			throw new UnauthorizedException('Refresh токен обязателен')

		const deviceId = this.getDeviceId(req)
		const { accessToken, refreshToken: newRefreshToken } =
			await this.authService.refreshTokens(refreshToken, deviceId)

		return { accessToken, refreshToken: newRefreshToken }
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Выход из системы' })
	@ApiBody({
		schema: {
			example: {
				refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
			}
		}
	})
	@ApiResponse({ status: 200, description: 'Выход выполнен успешно' })
	@ApiResponse({ status: 401, description: 'Неавторизован' })
	@HttpCode(HttpStatus.OK)
	async logout(
		@Req() req: Request,
		@CurrentUser('id') userId: string,
		@Body() body: { refreshToken: string }
	) {
		const deviceId = this.getDeviceId(req)

		if (body.refreshToken)
			await this.authService.logout(userId, body.refreshToken, deviceId)

		return { message: 'Выход выполнен успешно' }
	}

	private getDeviceId(req: Request): string {
		const headerDeviceId = req.headers['x-device-id'] as string
		if (headerDeviceId) {
			return headerDeviceId
		}

		const ua = req.headers['user-agent'] || 'unknown'
		const ip = req.ip || req.ips?.[0] || 'unknown'
		return Buffer.from(`${ua}${ip}`).toString('base64').substring(0, 32)
	}
}
