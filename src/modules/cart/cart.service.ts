import { CartItem, Prisma } from '@/database/prisma/generated/client'
import { PrismaService } from '@/database/prisma/prisma.service'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import {
	AddToCartDto,
	BulkCartOperationDto,
	RemoveFromCartDto
} from './dto/cart.dto'
import {
	CartItemResponse,
	cartProductSelect,
	CartResponse
} from './types/cart.types'

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService) {}

	async get(userId: string): Promise<CartResponse> {
		const cartItems = await this.prisma.cartItem.findMany({
			where: { userId },
			include: {
				product: {
					select: cartProductSelect
				}
			},
			orderBy: { createdAt: 'desc' }
		})

		const items: CartItemResponse[] = cartItems.map(item => ({
			...item.product,
			quantity: item.quantity,
			itemTotal: item.product.price * item.quantity
		}))

		const totalProducts = items.reduce((sum, item) => sum + item.quantity, 0)
		const totalPrice = items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		)

		return {
			items,
			totalProducts,
			totalPrice
		}
	}

	async add(userId: string, dto: AddToCartDto): Promise<CartResponse> {
		const { productId, quantity } = dto

		const product = await this.prisma.product.findUnique({
			where: { id: productId }
		})

		if (!product) {
			throw new NotFoundException('Продукт не найден')
		}

		if (!product.isActive) {
			throw new BadRequestException('Продукт неактивен')
		}

		const existingItem = await this.prisma.cartItem.findUnique({
			where: {
				userId_productId: {
					userId,
					productId
				}
			}
		})

		if (existingItem) {
			await this.prisma.cartItem.update({
				where: { id: existingItem.id },
				data: { quantity: existingItem.quantity + quantity }
			})
		} else {
			await this.prisma.cartItem.create({
				data: {
					userId,
					productId,
					quantity
				}
			})
		}

		return this.get(userId)
	}

	async remove(userId: string, dto: RemoveFromCartDto): Promise<CartResponse> {
		const { productId, quantity } = dto

		const existingItem = await this.prisma.cartItem.findUnique({
			where: {
				userId_productId: {
					userId,
					productId
				}
			}
		})

		if (!existingItem) {
			throw new NotFoundException('Товар в корзине не найден')
		}

		const newQuantity = existingItem.quantity - quantity

		if (newQuantity <= 0) {
			await this.prisma.cartItem.delete({
				where: { id: existingItem.id }
			})
		} else {
			await this.prisma.cartItem.update({
				where: { id: existingItem.id },
				data: { quantity: newQuantity }
			})
		}

		return this.get(userId)
	}

	async bulkAdd(
		userId: string,
		dto: BulkCartOperationDto
	): Promise<CartResponse> {
		const { items } = dto

		if (items.length === 0) {
			throw new BadRequestException('Список товаров пуст')
		}

		const productIds = items.map(item => item.productId)
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

		const existingItems = await this.prisma.cartItem.findMany({
			where: {
				userId,
				productId: { in: productIds }
			},
			select: { id: true, productId: true, quantity: true }
		})

		const existingMap = new Map(
			existingItems.map(item => [item.productId, item])
		)

		const updateOperations: Prisma.PrismaPromise<CartItem>[] = []
		const createOperations: Prisma.PrismaPromise<CartItem>[] = []

		for (const item of items) {
			const existing = existingMap.get(item.productId)
			if (existing) {
				updateOperations.push(
					this.prisma.cartItem.update({
						where: { id: existing.id },
						data: { quantity: existing.quantity + item.quantity }
					})
				)
			} else {
				createOperations.push(
					this.prisma.cartItem.create({
						data: {
							userId,
							productId: item.productId,
							quantity: item.quantity
						}
					})
				)
			}
		}

		await Promise.all([...updateOperations, ...createOperations])

		return this.get(userId)
	}

	async bulkRemove(
		userId: string,
		dto: BulkCartOperationDto
	): Promise<CartResponse> {
		const { items } = dto

		if (items.length === 0) {
			throw new BadRequestException('Список товаров пуст')
		}

		const productIds = items.map(item => item.productId)

		await this.prisma.cartItem.deleteMany({
			where: {
				userId,
				productId: { in: productIds }
			}
		})

		return this.get(userId)
	}

	async clear(userId: string): Promise<{ message: string }> {
		await this.prisma.cartItem.deleteMany({
			where: { userId }
		})

		return { message: 'Корзина очищена' }
	}
}
