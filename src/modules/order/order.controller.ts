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
import { CreateOrderDto } from './dto/create-order.dto'
import { GetOrdersQueryDto } from './dto/get-orders-query.dto'
import { OrderService } from './order.service'
import { OrderResponse } from './types/order.types'

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
	constructor(private orderService: OrderService) {}

	@Get('checkout')
	@HttpCode(HttpStatus.OK)
	async getCheckoutData(@CurrentUser('id') userId: string) {
		return this.orderService.getCheckoutData(userId)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@CurrentUser('id') userId: string,
		@Body() dto: CreateOrderDto
	): Promise<OrderResponse> {
		return this.orderService.create(userId, dto)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getOrders(
		@CurrentUser('id') userId: string,
		@Query() query: GetOrdersQueryDto
	): Promise<OrderResponse[]> {
		return this.orderService.getOrdersForUser(userId, query)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getOrder(
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	): Promise<OrderResponse> {
		return this.orderService.getOrderById(userId, id)
	}

	@Post(':id/repeat')
	@HttpCode(HttpStatus.OK)
	async repeatOrder(
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.orderService.repeatOrder(userId, id)
	}
}
