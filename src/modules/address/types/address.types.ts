import { Prisma } from '@/database/prisma/generated/client'

export const addressSelect = {
	id: true,
	label: true,
	street: true,
	house: true,
	apartment: true,
	entrance: true,
	floor: true,
	comment: true,
	isDefault: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.AddressSelect

export type AddressResponse = Prisma.AddressGetPayload<{
	select: typeof addressSelect
}>
