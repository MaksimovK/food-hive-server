import { Prisma } from '@/database/prisma/generated/client'

export const bannerSelect = {
	id: true,
	image: true,
	title: true,
	description: true,
	link: true,
	order: true,
	isActive: true
} satisfies Prisma.BannerSelect

export type BannerResponse = Prisma.BannerGetPayload<{
	select: typeof bannerSelect
}>
