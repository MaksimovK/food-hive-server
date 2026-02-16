import { registerAs } from '@nestjs/config';
import 'dotenv/config';

export default registerAs('auth', () => ({
  // JWT-параметры
  jwtSecret: process.env.JWT_SECRET || 'your_strong_secret_here_min_32_chars',
  jwtAccessTtl: process.env.JWT_ACCESS_TOKEN_TTL || '15m',
  jwtRefreshTtl: process.env.JWT_REFRESH_TOKEN_TTL || '7d',

  // Параметры безопасности
  refreshTokenHashRounds: 10, // Для Argon2
  maxActiveSessions: 5, // Максимум активных сессий на пользователя
  deviceIdHeader: 'x-device-id', // Заголовок для привязки к устройству
}));
