import { Prisma } from '@/database/prisma/generated/client'

export const favoriteProductSelect = {
	id: true,
	name: true,
	image: true,
	price: true,
	isActive: true
} satisfies Prisma.ProductSelect

export type FavoriteProductResponse = Prisma.ProductGetPayload<{
	select: typeof favoriteProductSelect
}>
