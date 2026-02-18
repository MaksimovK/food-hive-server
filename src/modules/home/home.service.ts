import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { HomeResponse } from './types/home-response.interface'

@Injectable()
export class HomeService {
	constructor(private prisma: PrismaService) {}

	async getHomeData(): Promise<HomeResponse> {
		const banners = await this.prisma.banner.findMany({
			where: { isActive: true },
			orderBy: { order: 'asc' },
			select: {
				id: true,
				image: true,
				title: true,
				description: true,
				link: true,
				order: true,
				isActive: true
			}
		})

		const categories = await this.prisma.category.findMany({
			where: { isActive: true },
			orderBy: { order: 'asc' },
			select: {
				id: true,
				name: true,
				image: true,
				description: true,
				order: true,
				isActive: true
			}
		})

		const products = await this.prisma.product.findMany({
			where: { isActive: true },
			include: {
				category: {
					select: {
						id: true,
						name: true
					}
				}
			},
			orderBy: { name: 'asc' }
		})

		const productsByCategory = categories.map(category => ({
			categoryId: category.id,
			categoryName: category.name,
			products: products
				.filter(p => p.categoryId === category.id)
				.map(p => ({
					id: p.id,
					name: p.name,
					description: p.description,
					image: p.image,
					price: p.price,
					caloriesPer100g: p.caloriesPer100g,
					proteinPer100g: p.proteinPer100g,
					fatPer100g: p.fatPer100g,
					carbsPer100g: p.carbsPer100g,
					servingSize: p.servingSize,
					isActive: p.isActive,
					categoryId: p.categoryId
				}))
		}))

		return {
			banners,
			categories,
			productsByCategory
		}
	}
}
