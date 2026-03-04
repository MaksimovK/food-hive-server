import { Prisma } from '@/database/prisma/generated/client'

export const cartProductSelect = {
	id: true,
	name: true,
	image: true,
	price: true,
	unit: true,
	servingSize: true,
	isActive: true
} satisfies Prisma.ProductSelect

export type CartProductResponse = Prisma.ProductGetPayload<{
	select: typeof cartProductSelect
}>

export interface CartItemResponse extends CartProductResponse {
	quantity: number
	itemTotal: number
}

export interface CartResponse {
	items: CartItemResponse[]
	totalProducts: number
	totalPrice: number
}
