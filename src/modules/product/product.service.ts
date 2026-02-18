import { Prisma } from '@/database/prisma/generated/client'
import { PrismaService } from '@/database/prisma/prisma.service'
import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { productSelect } from './types/product.types'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateProductDto) {
		const {
			name,
			description,
			image,
			price,
			caloriesPer100g,
			proteinPer100g,
			fatPer100g,
			carbsPer100g,
			servingSize,
			categoryId,
			isActive,
			ingredients
		} = dto

		const category = await this.prisma.category.findUnique({
			where: { id: categoryId }
		})

		if (!category) throw new NotFoundException('Категория не найдена')

		const existing = await this.prisma.product.findFirst({
			where: {
				name,
				categoryId
			}
		})

		if (existing)
			throw new ConflictException(
				'Продукт с таким названием уже существует в этой категории'
			)

		return this.prisma.product.create({
			data: {
				name,
				description,
				image,
				price,
				caloriesPer100g,
				proteinPer100g,
				fatPer100g,
				carbsPer100g,
				servingSize,
				categoryId,
				isActive: isActive ?? true,
				productIngredients: ingredients
					? {
							create: ingredients.map(ing => ({
								ingredientId: ing.ingredientId,
								amount: ing.amount,
								unit: ing.unit
							}))
						}
					: undefined
			},
			select: productSelect
		})
	}

	async findAll(categoryId?: string) {
		return this.prisma.product.findMany({
			where: {
				isActive: true,
				categoryId: categoryId
			},
			select: productSelect
		})
	}

	async findOne(id: string) {
		const product = await this.prisma.product.findUnique({
			where: { id, isActive: true },
			select: productSelect
		})

		if (!product) throw new NotFoundException('Продукт не найден')

		return product
	}

	async update(id: string, dto: UpdateProductDto) {
		const { name, categoryId, ingredients, ...rest } = dto

		await this.findOne(id)

		if (categoryId) {
			const category = await this.prisma.category.findUnique({
				where: { id: categoryId }
			})

			if (!category) throw new NotFoundException('Категория не найдена')
		}

		if (name || categoryId) {
			const existing = await this.prisma.product.findFirst({
				where: {
					name: name,
					categoryId: categoryId,
					id: { not: id }
				}
			})

			if (existing)
				throw new ConflictException(
					'Продукт с таким названием уже существует в этой категории'
				)
		}

		const updateData: Prisma.ProductUpdateInput = { ...rest }

		if (ingredients) {
			await this.prisma.productIngredient.deleteMany({
				where: { productId: id }
			})

			if (ingredients.length > 0) {
				updateData.productIngredients = {
					create: ingredients.map(ing => ({
						ingredientId: ing.ingredientId,
						amount: ing.amount,
						unit: ing.unit
					}))
				}
			}
		}

		return this.prisma.product.update({
			where: { id },
			data: updateData,
			select: productSelect
		})
	}

	async delete(id: string) {
		await this.findOne(id)

		await this.prisma.product.delete({
			where: { id },
			select: productSelect
		})
	}
}
