export class FavoriteResponse {
	id: string
	userId: string
	productId: string
	createdAt: Date
	updatedAt: Date
}

export class FavoriteProductResponse {
	id: string
	name: string
	description: string | null
	image: string
	price: number
	caloriesPer100g: number
	proteinPer100g: number
	fatPer100g: number
	carbsPer100g: number
	servingSize: number
	unit: string
	isActive: boolean
	categoryId: string
}
