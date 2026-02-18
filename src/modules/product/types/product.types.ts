import { Prisma } from '@/database/prisma/generated/client'

export const productSelect = {
	id: true,
	name: true,
	description: true,
	image: true,
	price: true,
	caloriesPer100g: true,
	proteinPer100g: true,
	fatPer100g: true,
	carbsPer100g: true,
	servingSize: true,
	isActive: true,
	categoryId: true,
	category: {
		select: {
			id: true,
			name: true,
			image: true
		}
	},
	productIngredients: {
		select: {
			id: true,
			amount: true,
			unit: true,
			ingredient: {
				select: {
					id: true,
					name: true,
					containsGluten: true,
					containsDairy: true,
					containsNuts: true,
					containsSoy: true,
					containsEggs: true
				}
			}
		}
	}
} satisfies Prisma.ProductSelect

export type ProductResponse = Prisma.ProductGetPayload<{
	select: typeof productSelect
}>
