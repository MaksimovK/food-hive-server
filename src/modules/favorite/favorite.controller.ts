import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { BulkOperationDto, ToggleFavoriteDto } from './dto/favorite.dto'
import { FavoriteService } from './favorite.service'

@Controller('favorites')
@ApiTags('favorite')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoriteController {
	constructor(private favoriteService: FavoriteService) {}

	@Get()
	@ApiOperation({ summary: 'Получить список избранного' })
	@ApiResponse({
		status: 200,
		description: 'Список избранного',
		schema: {
			example: [
				{
					id: 'uuid',
					name: 'Боржимо',
					description: 'Вода минеральная',
					image: '/images/product.png',
					price: 199.99,
					unit: 'г',
					caloriesPer100g: 45.5,
					proteinPer100g: 1.2,
					fatPer100g: 0.5,
					carbsPer100g: 10.3,
					servingSize: 500,
					isActive: true,
					categoryId: 'uuid',
					category: {
						id: 'uuid',
						name: 'Напитки',
						image: '/images/category.png'
					}
				}
			]
		}
	})
	@HttpCode(HttpStatus.OK)
	async findAll(@CurrentUser('id') userId: string) {
		return this.favoriteService.findAll(userId)
	}

	@Post('toggle')
	@ApiOperation({ summary: 'Добавить/удалить товар из избранного' })
	@ApiBody({
		schema: {
			example: {
				productId: 'uuid'
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'Статус избранного изменён',
		schema: {
			example: {
				added: true,
				favorite: {
					id: 'uuid',
					userId: 'uuid',
					productId: 'uuid',
					createdAt: '2024-01-01T00:00:00.000Z'
				}
			}
		}
	})
	@ApiResponse({ status: 404, description: 'Продукт не найден' })
	@HttpCode(HttpStatus.OK)
	async toggle(
		@CurrentUser('id') userId: string,
		@Body() dto: ToggleFavoriteDto
	) {
		return this.favoriteService.toggle(userId, dto)
	}

	@Post('bulk/add')
	@ApiOperation({ summary: 'Добавить несколько товаров в избранное' })
	@ApiBody({
		schema: {
			example: {
				productIds: ['uuid-1', 'uuid-2', 'uuid-3']
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'Товары добавлены в избранное',
		schema: {
			example: {
				added: 2,
				skipped: 1,
				productIds: ['uuid-1', 'uuid-2']
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Список продуктов пуст' })
	@ApiResponse({ status: 404, description: 'Продукты не найдены' })
	@HttpCode(HttpStatus.OK)
	async bulkAdd(
		@CurrentUser('id') userId: string,
		@Body() dto: BulkOperationDto
	) {
		return this.favoriteService.bulkAdd(userId, dto)
	}

	@Post('bulk/remove')
	@ApiOperation({ summary: 'Удалить несколько товаров из избранного' })
	@ApiBody({
		schema: {
			example: {
				productIds: ['uuid-1', 'uuid-2']
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'Товары удалены из избранного',
		schema: {
			example: {
				removed: 2,
				productIds: ['uuid-1', 'uuid-2']
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Список продуктов пуст' })
	@HttpCode(HttpStatus.OK)
	async bulkRemove(
		@CurrentUser('id') userId: string,
		@Body() dto: BulkOperationDto
	) {
		return this.favoriteService.bulkRemove(userId, dto)
	}

	@Delete('clear')
	@ApiOperation({ summary: 'Очистить всё избранное' })
	@ApiResponse({
		status: 200,
		description: 'Избранное очищено',
		schema: {
			example: {
				message: 'Избранное очищено'
			}
		}
	})
	@HttpCode(HttpStatus.OK)
	async clear(@CurrentUser('id') userId: string) {
		return this.favoriteService.clear(userId)
	}
}
