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
import { AddressService } from './address.service'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
	constructor(private addressService: AddressService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@CurrentUser('id') userId: string,
		@Body() dto: CreateAddressDto
	) {
		return this.addressService.create(userId, dto)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(@CurrentUser('id') userId: string) {
		return this.addressService.findAll(userId)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
		return this.addressService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	async update(
		@CurrentUser('id') userId: string,
		@Param('id') id: string,
		@Body() dto: UpdateAddressDto
	) {
		return this.addressService.update(userId, id, dto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
		return this.addressService.delete(userId, id)
	}

	@Patch(':id/set-default')
	@HttpCode(HttpStatus.OK)
	async setDefault(@CurrentUser('id') userId: string, @Param('id') id: string) {
		return this.addressService.setDefault(userId, id)
	}
}
