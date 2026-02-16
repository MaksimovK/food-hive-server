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
import type { Request } from 'express'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}

	@Post('login')
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
