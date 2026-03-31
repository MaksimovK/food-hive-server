import { PaymentMethod, Prisma } from '@/database/prisma/generated/client'
import { AddressResponse } from '@/modules/address/types/address.types'

export const orderItemSelect = {
	id: true,
	quantity: true,
	price: true,
	productName: true,
	product: {
		select: {
			id: true,
			image: true
		}
	}
} satisfies Prisma.OrderItemSelect

export type OrderItemResponse = Prisma.OrderItemGetPayload<{
	select: typeof orderItemSelect
}>

export const orderSelect = {
	id: true,
	userName: true,
	status: true,
	paymentMethod: true,
	totalAmount: true,
	deliveryStreet: true,
	deliveryHouse: true,
	deliveryApartment: true,
	deliveryEntrance: true,
	deliveryFloor: true,
	deliveryComment: true,
	deliveryPhone: true,
	orderComment: true,
	createdAt: true,
	orderItems: {
		select: orderItemSelect
	}
} satisfies Prisma.OrderSelect

export type OrderResponse = Prisma.OrderGetPayload<{
	select: typeof orderSelect
}>

export interface CheckoutCartItem {
	id: string
	image: string
	name: string
	price: number
	quantity: number
	itemTotal: number
}

export interface IPaymentMethod {
	value: PaymentMethod
	label: string
}

export interface CheckoutDataResponse {
	addresses: AddressResponse[]
	cartItems: CheckoutCartItem[]
	totalProducts: number
	totalPrice: number
	paymentMethods: IPaymentMethod[]
}
