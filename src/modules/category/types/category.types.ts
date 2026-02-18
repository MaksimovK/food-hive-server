import { Prisma } from '@/database/prisma/generated/client'

export const categorySelect = {
	id: true,
	name: true,
	description: true,
	image: true,
	order: true,
	isActive: true
} satisfies Prisma.CategorySelect

export type CategoryResponse = Prisma.CategoryGetPayload<{
	select: typeof categorySelect
}>
