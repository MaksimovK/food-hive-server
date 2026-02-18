import { Roles } from '@/common/decorators/roles.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { RolesGuard } from '@/common/guards/roles.guard'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common'
import { BannerService } from './banner.service'
import { CreateBannerDto } from './dto/create-banner.dto'
import { UpdateBannerDto } from './dto/update-banner.dto'

@Controller('banners')
export class BannerController {
	constructor(private bannerService: BannerService) {}

	@Get()
	async findAll() {
		return this.bannerService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.bannerService.findOne(id)
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateBannerDto) {
		return this.bannerService.create(dto)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	async update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
		return this.bannerService.update(id, dto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id') id: string) {
		await this.bannerService.delete(id)
	}
}
