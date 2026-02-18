import { SetMetadata } from '@nestjs/common'

/**
 * Ключ для хранения ролей в метаданных
 */
export const ROLES_KEY = 'roles'

/**
 * Декоратор для указания требуемых ролей
 * Используется вместе с RolesGuard
 *
 * Использование:
 *   @Roles('ADMIN')
 *   @Post()
 *   create() {
 *     // Доступно только админам
 *   }
 *
 *   @Roles('ADMIN', 'MANAGER')
 *   @Get()
 *   findAll() {
 *     // Доступно админам и менеджерам
 *   }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
