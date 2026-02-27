import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { IS_DEV_ENV } from './common/utils/is-dev.util'
import authConfig from './config/auth.config'
import { PrismaModule } from './database/prisma/prisma.module'
import { ApiModule } from './modules/api.modules'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEV_ENV,
			load: [authConfig]
		}),
		ServeStaticModule.forRoot({
			rootPath: process.cwd(),
			serveRoot: '/',
			renderPath: '/public'
		}),
		PrismaModule,
		ApiModule
	]
})
export class AppModule {}
