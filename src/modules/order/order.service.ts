import { PaymentMethod } from '@/database/prisma/generated/client'
import { PrismaService } from '@/database/prisma/prisma.service'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { AddressService } from '../address/address.service'
import { CartService } from '../cart/cart.service'
import { CreateOrderDto } from './dto/create-order.dto'
import {
	GetOrdersQueryDto,
	OrderSortBy,
	SortOrder
} from './dto/get-orders-query.dto'
import {
	CheckoutDataResponse,
	IPaymentMethod,
	OrderResponse,
	orderSelect
} from './types/order.types'

@Injectable()
export class OrderService {
	constructor(
		private prisma: PrismaService,
		private addressService: AddressService,
		private cartService: CartService
	) {}

	async getCheckoutData(userId: string): Promise<CheckoutDataResponse> {
		const [addresses, cart] = await Promise.all([
			this.addressService.findAll(userId),
			this.cartService.get(userId)
		])

		if (cart.items.length === 0) {
			throw new BadRequestException('Корзина пуста')
		}

		const cartItems = cart.items.map(item => ({
			id: item.id,
			image: item.image,
			name: item.name,
			price: item.price,
			quantity: item.quantity,
			itemTotal: item.itemTotal
		}))

		const paymentMethods: IPaymentMethod[] = [
			{ value: PaymentMethod.CASH, label: 'Наличными' },
			{ value: PaymentMethod.CARD, label: 'Картой при получение' }
		]

		return {
			addresses,
			cartItems,
			totalProducts: cart.totalProducts,
			totalPrice: cart.totalPrice,
			paymentMethods
		}
	}

	async create(userId: string, dto: CreateOrderDto): Promise<OrderResponse> {
		const { addressId, paymentMethod, orderComment } = dto

		const address = await this.addressService.findOne(userId, addressId)

		const cart = await this.cartService.get(userId)

		if (cart.items.length === 0) {
			throw new BadRequestException('Корзина пуста')
		}

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { name: true, phone: true }
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		const order = await this.prisma.order.create({
			data: {
				userId,
				userName: user.name,
				status: 'PENDING',
				paymentMethod: paymentMethod,
				totalAmount: cart.totalPrice,
				deliveryStreet: address.street,
				deliveryHouse: address.house,
				deliveryApartment: address.apartment,
				deliveryEntrance: address.entrance,
				deliveryFloor: address.floor,
				deliveryComment: address.comment,
				deliveryPhone: user.phone,
				orderComment: orderComment,
				orderItems: {
					create: cart.items.map(item => ({
						productId: item.id,
						productName: item.name,
						quantity: item.quantity,
						price: item.price
					}))
				}
			},
			select: orderSelect
		})

		await this.cartService.clear(userId)

		return order
	}

	async getOrdersForUser(
		userId: string,
		query: GetOrdersQueryDto
	): Promise<OrderResponse[]> {
		const { sortBy = OrderSortBy.DATE, sortOrder = SortOrder.DESC } = query

		const orderBy: { createdAt?: SortOrder; totalAmount?: SortOrder } = {}

		if (sortBy === OrderSortBy.DATE) {
			orderBy.createdAt = sortOrder
		} else if (sortBy === OrderSortBy.PRICE) {
			orderBy.totalAmount = sortOrder
		}

		return this.prisma.order.findMany({
			where: { userId },
			select: orderSelect,
			orderBy
		})
	}

	async getOrderById(userId: string, orderId: string): Promise<OrderResponse> {
		const order = await this.prisma.order.findUnique({
			where: { id: orderId, userId },
			select: orderSelect
		})

		if (!order) {
			throw new NotFoundException('Заказ не найден')
		}

		return order
	}

	async repeatOrder(userId: string, orderId: string) {
		const order = await this.prisma.order.findUnique({
			where: { id: orderId, userId },
			select: {
				id: true,
				orderItems: {
					select: {
						productId: true,
						quantity: true
					}
				}
			}
		})

		if (!order) {
			throw new NotFoundException('Заказ не найден')
		}

		const items = order.orderItems.filter(item => item.productId)

		if (items.length === 0) {
			throw new BadRequestException('В заказе нет товаров для повторения')
		}

		const productIds = items.map(item => item.productId!)

		const products = await this.prisma.product.findMany({
			where: {
				id: { in: productIds },
				isActive: true
			},
			select: { id: true, isActive: true }
		})

		if (products.length !== productIds.length) {
			const foundIds = products.map(p => p.id)
			const missingIds = productIds.filter(id => !foundIds.includes(id))
			throw new NotFoundException(
				`Товары не найдены или неактивны: ${missingIds.join(', ')}`
			)
		}

		await this.prisma.cartItem.deleteMany({
			where: { userId }
		})

		const cartItems = items.map(item => ({
			userId,
			productId: item.productId!,
			quantity: item.quantity
		}))

		await this.prisma.cartItem.createMany({
			data: cartItems
		})

		return this.cartService.get(userId)
	}
}
