import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards
} from '@nestjs/common'
import { BulkOperationDto, ToggleFavoriteDto } from './dto/favorite.dto'
import { FavoriteService } from './favorite.service'

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
	constructor(private favoriteService: FavoriteService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(@CurrentUser('id') userId: string) {
		return this.favoriteService.findAll(userId)
	}

	@Post('toggle')
	@HttpCode(HttpStatus.OK)
	async toggle(
		@CurrentUser('id') userId: string,
		@Body() dto: ToggleFavoriteDto
	) {
		return this.favoriteService.toggle(userId, dto)
	}

	@Post('bulk/add')
	@HttpCode(HttpStatus.OK)
	async bulkAdd(
		@CurrentUser('id') userId: string,
		@Body() dto: BulkOperationDto
	) {
		return this.favoriteService.bulkAdd(userId, dto)
	}

	@Post('bulk/remove')
	@HttpCode(HttpStatus.OK)
	async bulkRemove(
		@CurrentUser('id') userId: string,
		@Body() dto: BulkOperationDto
	) {
		return this.favoriteService.bulkRemove(userId, dto)
	}

	@Delete('clear')
	@HttpCode(HttpStatus.OK)
	async clear(@CurrentUser('id') userId: string) {
		return this.favoriteService.clear(userId)
	}
}
