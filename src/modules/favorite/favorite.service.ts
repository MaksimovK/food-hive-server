import { PrismaService } from '@/database/prisma/prisma.service'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { productSearchSelect } from '../product/types/product.types'
import { BulkOperationDto, ToggleFavoriteDto } from './dto/favorite.dto'
import { FavoriteProductResponse } from './types/favorite.types'

@Injectable()
export class FavoriteService {
	constructor(private prisma: PrismaService) {}

	async toggle(userId: string, dto: ToggleFavoriteDto) {
		const { productId } = dto

		const product = await this.prisma.product.findUnique({
			where: { id: productId }
		})

		if (!product) {
			throw new NotFoundException('Продукт не найден')
		}

		const existing = await this.prisma.favorite.findUnique({
			where: {
				userId_productId: {
					userId,
					productId
				}
			}
		})

		if (existing) {
			await this.prisma.favorite.delete({
				where: { id: existing.id }
			})
			return { added: false, productId }
		} else {
			const favorite = await this.prisma.favorite.create({
				data: {
					userId,
					productId
				}
			})
			return { added: true, favorite }
		}
	}

	async clear(userId: string) {
		await this.prisma.favorite.deleteMany({
			where: { userId }
		})
		return { message: 'Избранное очищено' }
	}

	async bulkAdd(userId: string, dto: BulkOperationDto) {
		const { productIds } = dto

		if (productIds.length === 0) {
			throw new BadRequestException('Список продуктов пуст')
		}

		const products = await this.prisma.product.findMany({
			where: { id: { in: productIds } },
			select: { id: true }
		})

		if (products.length !== productIds.length) {
			const foundIds = products.map(p => p.id)
			const missingIds = productIds.filter(id => !foundIds.includes(id))
			throw new NotFoundException(
				`Продукты не найдены: ${missingIds.join(', ')}`
			)
		}

		const existingFavorites = await this.prisma.favorite.findMany({
			where: {
				userId,
				productId: { in: productIds }
			},
			select: { productId: true }
		})

		const existingProductIds = existingFavorites.map(f => f.productId)
		const newProductIds = productIds.filter(
			id => !existingProductIds.includes(id)
		)

		if (newProductIds.length > 0) {
			await this.prisma.favorite.createMany({
				data: newProductIds.map(productId => ({
					userId,
					productId
				}))
			})
		}

		return {
			added: newProductIds.length,
			skipped: existingProductIds.length,
			productIds: newProductIds
		}
	}

	async bulkRemove(userId: string, dto: BulkOperationDto) {
		const { productIds } = dto

		if (productIds.length === 0) {
			throw new BadRequestException('Список продуктов пуст')
		}

		const result = await this.prisma.favorite.deleteMany({
			where: {
				userId,
				productId: { in: productIds }
			}
		})

		return {
			removed: result.count,
			productIds
		}
	}

	async findAll(userId: string): Promise<FavoriteProductResponse[]> {
		const favorites = await this.prisma.favorite.findMany({
			where: { userId },
			include: {
				product: {
					select: productSearchSelect
				}
			},
			orderBy: { createdAt: 'desc' }
		})

		return favorites.map(f => f.product)
	}
}
