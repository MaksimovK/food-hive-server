import { User } from '@/database/prisma/generated/client'
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

/**
 * Гвард для проверки роли пользователя
 * Используется для ограничения доступа к админским методам
 *
 * Использование:
 *   @UseGuards(RolesGuard)
 *   @Roles('ADMIN')
 *   @Post()
 *   create(@CurrentUser() user: User) {
 *     // Доступно только админам
 *   }
 */
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		// Получаем требуемые роли из декоратора @Roles
		const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
			context.getHandler(),
			context.getClass()
		])

		// Если роли не указаны, разрешаем доступ
		if (!requiredRoles || requiredRoles.length === 0) {
			return true
		}

		// Получаем пользователя из request (устанавливается JwtStrategy)
		const request = context
			.switchToHttp()
			.getRequest<Request & { user?: User }>()
		const user = request.user

		// Если пользователя нет в request, доступ запрещён
		if (!user) throw new ForbiddenException('Доступ запрещён')

		// Проверяем, есть ли роль пользователя в списке разрешённых
		if (!requiredRoles.includes(user.role))
			throw new ForbiddenException(
				'Недостаточно прав для выполнения этого действия'
			)

		return true
	}
}
