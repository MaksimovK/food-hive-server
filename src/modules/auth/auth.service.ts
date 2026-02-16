import { HashUtil } from '@/common/utils/hash.util'
import { ms } from '@/common/utils/ms.util'
import { PrismaService } from '@/database/prisma/prisma.service'
import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthUserResponse } from './types/auth-user-response.interface'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private configService: ConfigService,
		private userService: UserService
	) {}

	async register(dto: RegisterDto): Promise<{
		user: AuthUserResponse
		accessToken: string
		refreshToken: string
	}> {
		if (await this.userService.checkEmailExists(dto.email)) {
			throw new ConflictException('Пользователь с таким email уже существует')
		}

		const user = await this.userService.create(dto)

		const { accessToken, refreshToken } = await this.generateTokens(
			user.id,
			'initial-device'
		)

		return { user, accessToken, refreshToken }
	}

	async login(
		dto: LoginDto,
		deviceId: string
	): Promise<{
		user: AuthUserResponse
		accessToken: string
		refreshToken: string
	}> {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				avatar: true,
				role: true,
				password: true,
				createdAt: true
			}
		})

		if (!user) throw new UnauthorizedException('Неверный email или пароль')

		const isPasswordValid = await HashUtil.verify(user.password, dto.password)

		if (!isPasswordValid)
			throw new UnauthorizedException('Неверный email или пароль')

		const { accessToken, refreshToken } = await this.generateTokens(
			user.id,
			deviceId
		)

		const { password: _, ...userWithoutPassword } = user
		return { user: userWithoutPassword, accessToken, refreshToken }
	}

	async refreshTokens(refreshToken: string, deviceId: string) {
		try {
			const payload = this.jwtService.verify(refreshToken, {
				secret: this.configService.get('auth.jwtSecret'),
				algorithms: ['HS256']
			})

			if (payload.type !== 'refresh')
				throw new UnauthorizedException('Неверный тип токена')

			// Получаем все активные токены пользователя на этом устройстве
			const activeTokens = await this.prisma.refreshToken.findMany({
				where: {
					userId: payload.sub,
					deviceId,
					revoked: false,
					expiresAt: { gt: new Date() }
				}
			})

			// Перебираем и верифицируем каждый токен через Argon2
			let validToken: { id: string; tokenHash: string } | null = null
			for (const token of activeTokens) {
				if (await HashUtil.verify(token.tokenHash, refreshToken)) {
					validToken = token
					break
				}
			}

			if (!validToken)
				throw new UnauthorizedException('Refresh токен недействителен')

			// Генерируем новую пару токенов
			const { accessToken, refreshToken: newRefreshToken } =
				await this.generateTokens(payload.sub, deviceId)

			// Отзываем старый refresh-токен
			await this.prisma.refreshToken.update({
				where: { id: validToken.id },
				data: { revoked: true }
			})

			return { accessToken, refreshToken: newRefreshToken }
		} catch (error) {
			if (error instanceof UnauthorizedException) throw error
			throw new UnauthorizedException('Неверный refresh токен')
		}
	}

	async logout(userId: string, refreshToken: string, deviceId: string) {
		const activeTokens = await this.prisma.refreshToken.findMany({
			where: {
				userId,
				deviceId,
				revoked: false,
				expiresAt: { gt: new Date() }
			}
		})

		for (const token of activeTokens) {
			if (await HashUtil.verify(token.tokenHash, refreshToken)) {
				await this.prisma.refreshToken.update({
					where: { id: token.id },
					data: { revoked: true }
				})
				break
			}
		}
	}

	private async generateTokens(userId: string, deviceId: string) {
		const accessToken = this.jwtService.sign(
			{ sub: userId, type: 'access' },
			{
				expiresIn: this.configService.get('auth.jwtAccessTtl'),
				secret: this.configService.get('auth.jwtSecret'),
				algorithm: 'HS256'
			}
		)

		const refreshToken = this.jwtService.sign(
			{ sub: userId, type: 'refresh', deviceId },
			{
				expiresIn: this.configService.get('auth.jwtRefreshTtl'),
				secret: this.configService.get('auth.jwtSecret'),
				algorithm: 'HS256'
			}
		)

		const tokenHash = await HashUtil.hash(refreshToken)
		const refreshTokenTtl = this.configService.get('auth.jwtRefreshTtl')
		const expiresAt = new Date(Date.now() + ms(refreshTokenTtl))

		await this.prisma.refreshToken.create({
			data: {
				tokenHash,
				userId,
				deviceId,
				expiresAt
			}
		})

		return { accessToken, refreshToken }
	}
}
