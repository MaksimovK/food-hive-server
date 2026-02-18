import { Controller, Get } from '@nestjs/common'
import { HomeService } from './home.service'
import { HomeResponse } from './types/home-response.interface'

@Controller('home')
export class HomeController {
	constructor(private homeService: HomeService) {}

	@Get()
	async getHomeData(): Promise<HomeResponse> {
		return this.homeService.getHomeData()
	}
}
