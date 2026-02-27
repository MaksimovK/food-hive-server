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
	Query,
	UseGuards
} from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Get()
	async findAll(@Query('categoryId') categoryId?: string) {
		return this.productService.findAll(categoryId)
	}

	@Get('search')
	async search(@Query('q') q?: string) {
		return this.productService.search({ q })
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.productService.findOne(id)
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
		return this.productService.update(id, dto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id') id: string) {
		await this.productService.delete(id)
	}
}
