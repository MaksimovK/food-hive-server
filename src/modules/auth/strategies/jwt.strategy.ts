import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * Стратегия верификации access-токена
 * Работает с заголовком: Authorization: Bearer <access_token>
 *
 * Что делает:
 * 1. Извлекает токен из заголовка Authorization
 * 2. Верифицирует подпись и срок действия
 * 3. Загружает пользователя из БД (без пароля!)
 * 4. Записывает пользователя в req.user для дальнейшего использования
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private configService: ConfigService,
		private prisma: PrismaService
	) {
		super({
			// Извлекаем токен из заголовка: Authorization: Bearer <token>
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			// Отклоняем просроченные токены
			ignoreExpiration: false,
			// Секрет для верификации подписи
			secretOrKey: configService.get('auth.jwtSecret'),
			algorithms: ['HS256']
		})
	}

	/**
	 * Вызывается ПОСЛЕ успешной верификации JWT
	 * @param payload Расшифрованные данные из токена (в нашем случае { sub: userId, type: 'access' })
	 * @returns Объект пользователя для req.user
	 * @throws UnauthorizedException если пользователь не найден
	 */
	async validate(payload: { sub: string; type: string }) {
		if (payload.type !== 'access') {
			throw new UnauthorizedException('Неверный тип токена')
		}

		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				avatar: true,
				role: true,
				createdAt: true
			}
		})

		if (!user) {
			throw new UnauthorizedException('Пользователь не найден')
		}

		return user
	}
}
