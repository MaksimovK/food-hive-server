import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	app.useGlobalPipes(new ValidationPipe())
	app.setGlobalPrefix('api')

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true
	})

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Food Hive API')
		.setDescription('API для сервиса доставки еды')
		.setVersion('1.0')
		.addBearerAuth({
			description: 'Введите access-токен для авторизации',
			name: 'Authorization',
			in: 'header',
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT'
		})
		.addTag('auth', 'Аутентификация и регистрация')
		.addTag('user', 'Профиль пользователя')
		.addTag('products', 'Продукты')
		.addTag('cart', 'Корзина')
		.addTag('orders', 'Заказы')
		.addTag('favorite', 'Избранное')
		.addTag('address', 'Адреса доставки')
		.addTag('banner', 'Баннеры')
		.addTag('ingredient', 'Ингредиенты')
		.build()

	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('api/docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true
		}
	})

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
bootstrap()
