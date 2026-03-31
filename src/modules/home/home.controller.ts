import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { HomeService } from './home.service'
import { HomeResponse } from './types/home-response.interface'

@Controller('home')
@ApiTags('home')
export class HomeController {
	constructor(private homeService: HomeService) {}

	@Get()
	@ApiOperation({ summary: 'Получить данные для главной страницы' })
	@ApiResponse({
		status: 200,
		description: 'Данные главной страницы',
		schema: {
			example: {
				banners: [
					{
						id: 'uuid',
						image: '/images/banner1.png',
						title: 'Скидка 20%',
						description: 'На первый заказ',
						link: '/promo',
						order: 1,
						isActive: true
					}
				],
				categories: [
					{
						id: 'uuid',
						name: 'Напитки',
						image: '/images/category.png',
						description: 'Освежающие напитки',
						order: 1,
						isActive: true
					}
				],
				productsByCategory: [
					{
						categoryId: 'uuid',
						categoryName: 'Напитки',
						products: [
							{
								id: 'uuid',
								name: 'Боржимо',
								description: 'Вода минеральная',
								image: '/images/product.png',
								price: 199.99,
								unit: 'г',
								caloriesPer100g: 45.5,
								proteinPer100g: 1.2,
								fatPer100g: 0.5,
								carbsPer100g: 10.3,
								servingSize: 500,
								isActive: true,
								categoryId: 'uuid'
							}
						]
					}
				]
			}
		}
	})
	async getHomeData(): Promise<HomeResponse> {
		return this.homeService.getHomeData()
	}
}
