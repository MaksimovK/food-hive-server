import { PrismaService } from '@/database/prisma/prisma.service'
import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { ingredientSelect } from './types/ingredient.types'

@Injectable()
export class IngredientService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateIngredientDto) {
		const {
			name,
			containsGluten,
			containsDairy,
			containsNuts,
			containsSoy,
			containsEggs
		} = dto

		const existing = await this.prisma.ingredient.findUnique({
			where: { name }
		})

		if (existing)
			throw new ConflictException('Ингредиент с таким названием уже существует')

		return this.prisma.ingredient.create({
			data: {
				name,
				containsGluten: containsGluten ?? false,
				containsDairy: containsDairy ?? false,
				containsNuts: containsNuts ?? false,
				containsSoy: containsSoy ?? false,
				containsEggs: containsEggs ?? false
			},
			select: ingredientSelect
		})
	}

	async findAll() {
		return this.prisma.ingredient.findMany({
			orderBy: { name: 'asc' },
			select: ingredientSelect
		})
	}

	async findOne(id: string) {
		const ingredient = await this.prisma.ingredient.findUnique({
			where: { id },
			select: ingredientSelect
		})

		if (!ingredient) throw new NotFoundException('Ингредиент не найден')

		return ingredient
	}

	async update(id: string, dto: UpdateIngredientDto) {
		const { name } = dto

		await this.findOne(id)

		if (name) {
			const existing = await this.prisma.ingredient.findUnique({
				where: { name }
			})

			if (existing && existing.id !== id)
				throw new ConflictException(
					'Ингредиент с таким названием уже существует'
				)
		}

		return this.prisma.ingredient.update({
			where: { id },
			data: dto,
			select: ingredientSelect
		})
	}

	async delete(id: string) {
		await this.findOne(id)

		const productCount = await this.prisma.productIngredient.count({
			where: { ingredientId: id }
		})

		if (productCount > 0)
			throw new BadRequestException(
				`Невозможно удалить ингредиент: он используется в ${productCount} продукте(ах)`
			)

		await this.prisma.ingredient.delete({
			where: { id },
			select: ingredientSelect
		})
	}
}
