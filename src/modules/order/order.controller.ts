import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	UseGuards
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { CreateOrderDto } from './dto/create-order.dto'
import { GetOrdersQueryDto } from './dto/get-orders-query.dto'
import { OrderService } from './order.service'
import { OrderResponse } from './types/order.types'

@Controller('orders')
@ApiTags('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
	constructor(private orderService: OrderService) {}

	@Get('checkout')
	@ApiOperation({ summary: 'Получить данные для оформления заказа' })
	@ApiResponse({
		status: 200,
		description: 'Данные для оформления заказа',
		schema: {
			example: {
				addresses: [
					{
						id: 'uuid',
						street: 'ул. Пушкина',
						house: '10',
						apartment: '25',
						entrance: '1',
						floor: '3',
						comment: 'Домофон не работает',
						isDefault: true
					}
				],
				cartItems: [
					{
						id: 'uuid',
						image: '/images/product.png',
						name: 'Боржимо',
						price: 199.99,
						quantity: 2,
						itemTotal: 399.98
					}
				],
				totalProducts: 2,
				totalPrice: 399.98,
				paymentMethods: [
					{ value: 'CASH', label: 'Наличными' },
					{ value: 'CARD', label: 'Картой при получении' }
				]
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Корзина пуста' })
	@HttpCode(HttpStatus.OK)
	async getCheckoutData(@CurrentUser('id') userId: string) {
		return this.orderService.getCheckoutData(userId)
	}

	@Post()
	@ApiOperation({ summary: 'Создать заказ' })
	@ApiBody({ type: CreateOrderDto })
	@ApiResponse({
		status: 201,
		description: 'Заказ создан',
		schema: {
			example: {
				id: 'uuid',
				userName: 'Иван Иванов',
				status: 'PENDING',
				paymentMethod: 'CARD',
				totalAmount: 399.98,
				deliveryStreet: 'ул. Пушкина',
				deliveryHouse: '10',
				deliveryApartment: '25',
				deliveryEntrance: '1',
				deliveryFloor: '3',
				deliveryComment: 'Домофон не работает',
				deliveryPhone: '+79991234567',
				orderComment: 'Не звонить в дверь',
				createdAt: '2024-01-01T12:00:00.000Z',
				orderItems: [
					{
						id: 'uuid',
						quantity: 2,
						price: 199.99,
						productName: 'Боржимо',
						product: {
							id: 'uuid',
							image: '/images/product.png'
						}
					}
				]
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Корзина пуста' })
	@ApiResponse({ status: 404, description: 'Адрес или пользователь не найдены' })
	@HttpCode(HttpStatus.CREATED)
	async create(
		@CurrentUser('id') userId: string,
		@Body() dto: CreateOrderDto
	): Promise<OrderResponse> {
		return this.orderService.create(userId, dto)
	}

	@Get()
	@ApiOperation({ summary: 'Получить все заказы пользователя' })
	@ApiQuery({
		name: 'sortBy',
		required: false,
		description: 'Сортировка: date или price',
		enum: ['date', 'price']
	})
	@ApiQuery({
		name: 'sortOrder',
		required: false,
		description: 'Порядок сортировки: asc или desc',
		enum: ['asc', 'desc']
	})
	@ApiResponse({
		status: 200,
		description: 'Список заказов',
		schema: {
			example: [
				{
					id: 'uuid',
					userName: 'Иван Иванов',
					status: 'DELIVERED',
					paymentMethod: 'CARD',
					totalAmount: 599.97,
					deliveryStreet: 'ул. Пушкина',
					deliveryHouse: '10',
					deliveryApartment: '25',
					deliveryEntrance: '1',
					deliveryFloor: '3',
					deliveryComment: 'Домофон не работает',
					deliveryPhone: '+79991234567',
					orderComment: null,
					createdAt: '2024-01-01T12:00:00.000Z',
					orderItems: [
						{
							id: 'uuid',
							quantity: 3,
							price: 199.99,
							productName: 'Боржимо',
							product: {
								id: 'uuid',
								image: '/images/product.png'
							}
						}
					]
				}
			]
		}
	})
	@HttpCode(HttpStatus.OK)
	async getOrders(
		@CurrentUser('id') userId: string,
		@Query() query: GetOrdersQueryDto
	): Promise<OrderResponse[]> {
		return this.orderService.getOrdersForUser(userId, query)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить заказ по ID' })
	@ApiParam({ name: 'id', description: 'ID заказа' })
	@ApiResponse({
		status: 200,
		description: 'Заказ найден',
		schema: {
			example: {
				id: 'uuid',
				userName: 'Иван Иванов',
				status: 'PENDING',
				paymentMethod: 'CARD',
				totalAmount: 399.98,
				deliveryStreet: 'ул. Пушкина',
				deliveryHouse: '10',
				deliveryApartment: '25',
				deliveryEntrance: '1',
				deliveryFloor: '3',
				deliveryComment: 'Домофон не работает',
				deliveryPhone: '+79991234567',
				orderComment: 'Не звонить в дверь',
				createdAt: '2024-01-01T12:00:00.000Z',
				orderItems: [
					{
						id: 'uuid',
						quantity: 2,
						price: 199.99,
						productName: 'Боржимо',
						product: {
							id: 'uuid',
							image: '/images/product.png'
						}
					}
				]
			}
		}
	})
	@ApiResponse({ status: 404, description: 'Заказ не найден' })
	@HttpCode(HttpStatus.OK)
	async getOrder(
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	): Promise<OrderResponse> {
		return this.orderService.getOrderById(userId, id)
	}

	@Post(':id/repeat')
	@ApiOperation({ summary: 'Повторить заказ (добавить товары в корзину)' })
	@ApiParam({ name: 'id', description: 'ID заказа для повтора' })
	@ApiResponse({
		status: 200,
		description: 'Заказ повторён, товары добавлены в корзину',
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
	@ApiResponse({ status: 404, description: 'Заказ не найден' })
	@ApiResponse({ status: 400, description: 'В заказе нет товаров для повторения' })
	@HttpCode(HttpStatus.OK)
	async repeatOrder(
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.orderService.repeatOrder(userId, id)
	}
}
