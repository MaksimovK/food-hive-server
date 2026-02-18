import { PrismaService } from '@/database/prisma/prisma.service'
import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { categorySelect } from './types/category.types'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateCategoryDto) {
		const { name, description, image, order, isActive } = dto

		const existing = await this.prisma.category.findUnique({
			where: { name }
		})

		if (existing)
			throw new ConflictException('Категория с таким названием уже существует')

		return this.prisma.category.create({
			data: {
				name,
				description,
				image,
				order: order ?? 0,
				isActive: isActive ?? true
			},
			select: categorySelect
		})
	}

	async findAll() {
		return this.prisma.category.findMany({
			where: { isActive: true },
			orderBy: { order: 'asc' },
			select: categorySelect
		})
	}

	async findOne(id: string) {
		const category = await this.prisma.category.findUnique({
			where: { id, isActive: true },
			select: categorySelect
		})

		if (!category) throw new NotFoundException('Категория не найдена')

		return category
	}

	async update(id: string, dto: UpdateCategoryDto) {
		const { name } = dto

		await this.findOne(id)

		if (name) {
			const existing = await this.prisma.category.findUnique({
				where: { name }
			})

			if (existing && existing.id !== id)
				throw new ConflictException(
					'Категория с таким названием уже существует'
				)
		}

		return this.prisma.category.update({
			where: { id },
			data: dto,
			select: categorySelect
		})
	}

	async delete(id: string) {
		await this.findOne(id)

		const productCount = await this.prisma.product.count({
			where: { categoryId: id }
		})

		if (productCount > 0)
			throw new ConflictException(
				`Невозможно удалить категорию: в ней находится ${productCount} продукт(а/ов)`
			)

		await this.prisma.category.delete({
			where: { id },
			select: categorySelect
		})
	}
}
