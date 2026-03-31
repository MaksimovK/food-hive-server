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
import { CartService } from './cart.service'
import {
	AddToCartDto,
	BulkCartOperationDto,
	RemoveFromCartDto
} from './dto/cart.dto'

@Controller('cart')
@ApiTags('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
	constructor(private cartService: CartService) {}

	@Get()
	@ApiOperation({ summary: 'Получить корзину' })
	@ApiResponse({
		status: 200,
		description: 'Корзина получена',
		schema: {
			example: {
				items: [
					{
						id: 'uuid',
						name: 'Боржимо',
						image: '/images/product.png',
						price: 199.99,
						unit: 'г',
						servingSize: 500,
						isActive: true,
						quantity: 2,
						itemTotal: 399.98
					}
				],
				totalProducts: 2,
				totalPrice: 399.98
			}
		}
	})
	@HttpCode(HttpStatus.OK)
	async get(@CurrentUser('id') userId: string) {
		return this.cartService.get(userId)
	}

	@Post('add')
	@ApiOperation({ summary: 'Добавить товар в корзину' })
	@ApiBody({
		schema: {
			example: {
				productId: 'uuid',
				quantity: 2
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'Товар добавлен в корзину',
		schema: {
			example: {
				items: [
					{
						id: 'uuid',
						name: 'Боржимо',
						image: '/images/product.png',
						price: 199.99,
						unit: 'г',
						servingSize: 500,
						isActive: true,
						quantity: 3,
						itemTotal: 599.97
					}
				],
				totalProducts: 3,
				totalPrice: 599.97
			}
		}
	})
	@ApiResponse({ status: 404, description: 'Продукт не найден' })
	@ApiResponse({ status: 400, description: 'Продукт неактивен' })
	@HttpCode(HttpStatus.OK)
	async add(@CurrentUser('id') userId: string, @Body() dto: AddToCartDto) {
		return this.cartService.add(userId, dto)
	}

	@Post('remove')
	@ApiOperation({ summary: 'Удалить товар из корзины' })
	@ApiBody({
		schema: {
			example: {
				productId: 'uuid',
				quantity: 1
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'Товар удалён из корзины'
	})
	@ApiResponse({ status: 404, description: 'Товар в корзине не найден' })
	@HttpCode(HttpStatus.OK)
	async remove(
		@CurrentUser('id') userId: string,
		@Body() dto: RemoveFromCartDto
	) {
		return this.cartService.remove(userId, dto)
	}

	@Post('bulk/add')
	@ApiOperation({ summary: 'Добавить несколько товаров в корзину' })
	@ApiBody({
		schema: {
			example: {
				items: [
					{ productId: 'uuid-1', quantity: 2 },
					{ productId: 'uuid-2', quantity: 1 }
				]
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'Товары добавлены в корзину'
	})
	@ApiResponse({ status: 400, description: 'Список товаров пуст' })
	@ApiResponse({ status: 404, description: 'Товары не найдены или неактивны' })
	@HttpCode(HttpStatus.OK)
	async bulkAdd(
		@CurrentUser('id') userId: string,
		@Body() dto: BulkCartOperationDto
	) {
		return this.cartService.bulkAdd(userId, dto)
	}

	@Post('bulk/remove')
	@ApiOperation({ summary: 'Удалить несколько товаров из корзины' })
	@ApiBody({
		schema: {
			example: {
				items: [
					{ productId: 'uuid-1' },
					{ productId: 'uuid-2' }
				]
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'Товары удалены из корзины'
	})
	@ApiResponse({ status: 400, description: 'Список товаров пуст' })
	@HttpCode(HttpStatus.OK)
	async bulkRemove(
		@CurrentUser('id') userId: string,
		@Body() dto: BulkCartOperationDto
	) {
		return this.cartService.bulkRemove(userId, dto)
	}

	@Delete('clear')
	@ApiOperation({ summary: 'Очистить корзину' })
	@ApiResponse({
		status: 200,
		description: 'Корзина очищена',
		schema: {
			example: {
				message: 'Корзина очищена'
			}
		}
	})
	@HttpCode(HttpStatus.OK)
	async clear(@CurrentUser('id') userId: string) {
		return this.cartService.clear(userId)
	}
}
