export interface HomeResponse {
	banners: {
		id: string
		image: string
		title: string | null
		description: string | null
		link: string | null
		order: number
		isActive: boolean
	}[]
	categories: {
		id: string
		name: string
		image: string | null
		description: string | null
		order: number
		isActive: boolean
	}[]
	productsByCategory: {
		categoryId: string
		categoryName: string
		products: {
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
			isActive: boolean
			categoryId: string
		}[]
	}[]
}
