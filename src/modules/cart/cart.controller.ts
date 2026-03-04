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
import { CartService } from './cart.service'
import {
	AddToCartDto,
	BulkCartOperationDto,
	RemoveFromCartDto
} from './dto/cart.dto'

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
	constructor(private cartService: CartService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async get(@CurrentUser('id') userId: string) {
		return this.cartService.get(userId)
	}

	@Post('add')
	@HttpCode(HttpStatus.OK)
	async add(@CurrentUser('id') userId: string, @Body() dto: AddToCartDto) {
		return this.cartService.add(userId, dto)
	}

	@Post('remove')
	@HttpCode(HttpStatus.OK)
	async remove(
		@CurrentUser('id') userId: string,
		@Body() dto: RemoveFromCartDto
	) {
		return this.cartService.remove(userId, dto)
	}

	@Post('bulk/add')
	@HttpCode(HttpStatus.OK)
	async bulkAdd(
		@CurrentUser('id') userId: string,
		@Body() dto: BulkCartOperationDto
	) {
		return this.cartService.bulkAdd(userId, dto)
	}

	@Post('bulk/remove')
	@HttpCode(HttpStatus.OK)
	async bulkRemove(
		@CurrentUser('id') userId: string,
		@Body() dto: BulkCartOperationDto
	) {
		return this.cartService.bulkRemove(userId, dto)
	}

	@Delete('clear')
	@HttpCode(HttpStatus.OK)
	async clear(@CurrentUser('id') userId: string) {
		return this.cartService.clear(userId)
	}
}
