import { Prisma } from '@/database/prisma/generated/client'

export const ingredientSelect = {
	id: true,
	name: true,
	containsGluten: true,
	containsDairy: true,
	containsNuts: true,
	containsSoy: true,
	containsEggs: true
} satisfies Prisma.IngredientSelect

export type IngredientResponse = Prisma.IngredientGetPayload<{
	select: typeof ingredientSelect
}>
