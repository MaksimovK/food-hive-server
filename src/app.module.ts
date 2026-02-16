import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { IS_DEV_ENV } from './common/utils/is-dev.util'
import { PrismaModule } from './database/prisma/prisma.module'
import { ApiModule } from './modules/api.modules'
import authConfig from './config/auth.config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEV_ENV,
			load: [authConfig]
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
			serveRoot: '/',
			exclude: ['/api*']
		}),
		PrismaModule,
		ApiModule
	]
})
export class AppModule {}
