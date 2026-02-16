import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
	secret: configService.getOrThrow('auth.jwtSecret'),
	signOptions: {
		expiresIn: configService.getOrThrow('auth.jwtAccessTtl'),
		algorithm: 'HS256'
	},
	verifyOptions: {
		algorithms: ['HS256']
	}
})
