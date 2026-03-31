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
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { BannerService } from './banner.service'
import { CreateBannerDto } from './dto/create-banner.dto'
import { UpdateBannerDto } from './dto/update-banner.dto'

@Controller('banners')
@ApiTags('banner')
export class BannerController {
	constructor(private bannerService: BannerService) {}

	@Get()
	@ApiOperation({ summary: 'Получить все баннеры' })
	@ApiResponse({
		status: 200,
		description: 'Список баннеров',
		schema: {
			example: [
				{
					id: 'uuid',
					image: '/images/banner1.png',
					title: 'Скидка 20%',
					description: 'На первый заказ',
					link: '/promo',
					order: 1,
					isActive: true,
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			]
		}
	})
	async findAll() {
		return this.bannerService.findAll()
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить баннер по ID' })
	@ApiParam({ name: 'id', description: 'ID баннера' })
	@ApiResponse({
		status: 200,
		description: 'Баннер найден',
		schema: {
			example: {
				id: 'uuid',
				image: '/images/banner1.png',
				title: 'Скидка 20%',
				description: 'На первый заказ',
				link: '/promo',
				order: 1,
				isActive: true,
				createdAt: '2024-01-01T00:00:00.000Z',
				updatedAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@ApiResponse({ status: 404, description: 'Баннер не найден' })
	async findOne(@Param('id') id: string) {
		return this.bannerService.findOne(id)
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles('ADMIN')
	@ApiOperation({ summary: 'Создать баннер (только админ)' })
	@ApiBody({ type: CreateBannerDto })
	@ApiResponse({
		status: 201,
		description: 'Баннер создан',
		schema: {
			example: {
				id: 'uuid',
				image: '/images/banner1.png',
				title: 'Скидка 20%',
				description: 'На первый заказ',
				link: '/promo',
				order: 1,
				isActive: true,
				createdAt: '2024-01-01T00:00:00.000Z',
				updatedAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateBannerDto) {
		return this.bannerService.create(dto)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles('ADMIN')
	@ApiOperation({ summary: 'Обновить баннер (только админ)' })
	@ApiParam({ name: 'id', description: 'ID баннера' })
	@ApiResponse({
		status: 200,
		description: 'Баннер обновлён'
	})
	@ApiResponse({ status: 404, description: 'Баннер не найден' })
	async update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
		return this.bannerService.update(id, dto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles('ADMIN')
	@ApiOperation({ summary: 'Удалить баннер (только админ)' })
	@ApiParam({ name: 'id', description: 'ID баннера' })
	@ApiResponse({ status: 204, description: 'Баннер удалён' })
	@ApiResponse({ status: 404, description: 'Баннер не найден' })
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id') id: string) {
		await this.bannerService.delete(id)
	}
}
