import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
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
import { AddressService } from './address.service'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

@Controller('addresses')
@ApiTags('address')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressController {
	constructor(private addressService: AddressService) {}

	@Post()
	@ApiOperation({ summary: 'Создать адрес доставки' })
	@ApiBody({ type: CreateAddressDto })
	@ApiResponse({
		status: 201,
		description: 'Адрес создан',
		schema: {
			example: {
				id: 'uuid',
				street: 'ул. Пушкина',
				house: '10',
				apartment: '25',
				entrance: '1',
				floor: '3',
				comment: 'Домофон не работает',
				isDefault: true,
				label: 'Дом',
				userId: 'uuid',
				createdAt: '2024-01-01T00:00:00.000Z',
				updatedAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@HttpCode(HttpStatus.CREATED)
	async create(
		@CurrentUser('id') userId: string,
		@Body() dto: CreateAddressDto
	) {
		return this.addressService.create(userId, dto)
	}

	@Get()
	@ApiOperation({ summary: 'Получить все адреса доставки' })
	@ApiResponse({
		status: 200,
		description: 'Список адресов',
		schema: {
			example: [
				{
					id: 'uuid',
					street: 'ул. Пушкина',
					house: '10',
					apartment: '25',
					entrance: '1',
					floor: '3',
					comment: 'Домофон не работает',
					isDefault: true,
					label: 'Дом',
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				},
				{
					id: 'uuid-2',
					street: 'пр. Ленина',
					house: '50',
					apartment: null,
					entrance: '2',
					floor: '5',
					comment: null,
					isDefault: false,
					label: 'Работа',
					createdAt: '2024-01-02T00:00:00.000Z',
					updatedAt: '2024-01-02T00:00:00.000Z'
				}
			]
		}
	})
	@HttpCode(HttpStatus.OK)
	async findAll(@CurrentUser('id') userId: string) {
		return this.addressService.findAll(userId)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить адрес по ID' })
	@ApiParam({ name: 'id', description: 'ID адреса' })
	@ApiResponse({
		status: 200,
		description: 'Адрес найден',
		schema: {
			example: {
				id: 'uuid',
				street: 'ул. Пушкина',
				house: '10',
				apartment: '25',
				entrance: '1',
				floor: '3',
				comment: 'Домофон не работает',
				isDefault: true,
				label: 'Дом',
				createdAt: '2024-01-01T00:00:00.000Z',
				updatedAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@ApiResponse({ status: 404, description: 'Адрес не найден' })
	@HttpCode(HttpStatus.OK)
	async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
		return this.addressService.findOne(userId, id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Обновить адрес' })
	@ApiParam({ name: 'id', description: 'ID адреса' })
	@ApiResponse({
		status: 200,
		description: 'Адрес обновлён'
	})
	@ApiResponse({ status: 404, description: 'Адрес не найден' })
	@HttpCode(HttpStatus.OK)
	async update(
		@CurrentUser('id') userId: string,
		@Param('id') id: string,
		@Body() dto: UpdateAddressDto
	) {
		return this.addressService.update(userId, id, dto)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удалить адрес' })
	@ApiParam({ name: 'id', description: 'ID адреса' })
	@ApiResponse({
		status: 200,
		description: 'Адрес удалён'
	})
	@ApiResponse({ status: 404, description: 'Адрес не найден' })
	@HttpCode(HttpStatus.OK)
	async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
		return this.addressService.delete(userId, id)
	}

	@Patch(':id/set-default')
	@ApiOperation({ summary: 'Установить адрес по умолчанию' })
	@ApiParam({ name: 'id', description: 'ID адреса' })
	@ApiResponse({
		status: 200,
		description: 'Адрес установлен по умолчанию'
	})
	@ApiResponse({ status: 404, description: 'Адрес не найден' })
	@HttpCode(HttpStatus.OK)
	async setDefault(@CurrentUser('id') userId: string, @Param('id') id: string) {
		return this.addressService.setDefault(userId, id)
	}
}
