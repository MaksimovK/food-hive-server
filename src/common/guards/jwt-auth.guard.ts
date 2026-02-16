import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Гвард для защиты роутов с помощью access-токена
 * Автоматически применяет стратегию 'jwt' (JwtStrategy)
 *
 * Использование:
 *   @UseGuards(JwtAuthGuard)
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: User) {
 *     return user;
 *   }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
