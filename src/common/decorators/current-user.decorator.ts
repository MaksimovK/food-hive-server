import { User } from '@/database/prisma/generated/client'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

/**
 * Декоратор для получения данных текущего авторизованного пользователя
 * Автоматически извлекает пользователя из req.user (устанавливается Passport после верификации JWT)
 *
 * Использование:
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: User) {
 *     return user;
 *   }
 *
 *   @Get('profile/email')
 *   getEmail(@CurrentUser('email') email: string) {
 *     return { email };
 *   }
 */
export const CurrentUser = createParamDecorator(
	(data: keyof User | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request & { user?: User }>()
		const user = request.user

		if (!user) return null

		return data !== undefined ? user[data] : user
	}
)
