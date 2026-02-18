import { Prisma } from '@/database/prisma/generated/client'

export const userSelect = {
	id: true,
	email: true,
	name: true,
	phone: true,
	avatar: true,
	role: true,
	createdAt: true
} satisfies Prisma.UserSelect

export type UserResponse = Prisma.UserGetPayload<{
	select: typeof userSelect
}>
