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
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductService } from './product.service'

@Controller('products')
@ApiTags('products')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Get()
	@ApiOperation({ summary: 'Получить все продукты' })
	@ApiQuery({ name: 'categoryId', required: false, description: 'ID категории' })
	@ApiResponse({
		status: 200,
		description: 'Список продуктов',
		schema: {
			example: [
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
					categoryId: 'uuid',
					category: {
						id: 'uuid',
						name: 'Напитки',
						image: '/images/category.png'
					},
					productIngredients: [
						{
							id: 'uuid',
							amount: 10,
							unit: 'г',
							ingredient: {
								id: 'uuid',
								name: 'Сахар',
								containsGluten: false,
								containsDairy: false,
								containsNuts: false,
								containsSoy: false,
								containsEggs: false
							}
						}
					]
				}
			]
		}
	})
	async findAll(@Query('categoryId') categoryId?: string) {
		return this.productService.findAll(categoryId)
	}

	@Get('search')
	@ApiOperation({ summary: 'Поиск продуктов' })
	@ApiQuery({ name: 'q', required: false, description: 'Поисковый запрос' })
	@ApiQuery({ name: 'limit', required: false, description: 'Лимит (макс. 100)', example: 20 })
	@ApiQuery({ name: 'offset', required: false, description: 'Смещение', example: 0 })
	@ApiResponse({
		status: 200,
		description: 'Результаты поиска',
		schema: {
			example: [
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
	})
	async search(
		@Query('q') q?: string,
		@Query('limit') limit?: number,
		@Query('offset') offset?: number
	) {
		return this.productService.search({
			q,
			limit: limit ? Number(limit) : undefined,
			offset: offset ? Number(offset) : undefined
		})
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить продукт по ID' })
	@ApiParam({ name: 'id', description: 'ID продукта' })
	@ApiResponse({
		status: 200,
		description: 'Продукт найден',
		schema: {
			example: {
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
				categoryId: 'uuid',
				category: {
					id: 'uuid',
					name: 'Напитки',
					image: '/images/category.png'
				},
				productIngredients: []
			}
		}
	})
	@ApiResponse({ status: 404, description: 'Продукт не найден' })
	async findOne(@Param('id') id: string) {
		return this.productService.findOne(id)
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles('ADMIN')
	@ApiOperation({ summary: 'Создать продукт (только админ)' })
	@ApiBody({ type: CreateProductDto })
	@ApiResponse({
		status: 201,
		description: 'Продукт создан',
		schema: {
			example: {
				id: 'uuid',
				name: 'Новый продукт',
				description: 'Описание',
				image: '/images/product.png',
				price: 299.99,
				unit: 'г',
				caloriesPer100g: 50,
				proteinPer100g: 2,
				fatPer100g: 1,
				carbsPer100g: 15,
				servingSize: 400,
				isActive: true,
				categoryId: 'uuid',
				category: {
					id: 'uuid',
					name: 'Категория',
					image: '/images/cat.png'
				},
				productIngredients: []
			}
		}
	})
	@ApiResponse({ status: 404, description: 'Категория не найдена' })
	@ApiResponse({ status: 409, description: 'Продукт уже существует' })
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles('ADMIN')
	@ApiOperation({ summary: 'Обновить продукт (только админ)' })
	@ApiParam({ name: 'id', description: 'ID продукта' })
	@ApiResponse({
		status: 200,
		description: 'Продукт обновлён'
	})
	@ApiResponse({ status: 404, description: 'Продукт или категория не найдены' })
	@ApiResponse({ status: 409, description: 'Продукт с таким названием уже существует' })
	async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
		return this.productService.update(id, dto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles('ADMIN')
	@ApiOperation({ summary: 'Удалить продукт (только админ)' })
	@ApiParam({ name: 'id', description: 'ID продукта' })
	@ApiResponse({ status: 204, description: 'Продукт удалён' })
	@ApiResponse({ status: 404, description: 'Продукт не найден' })
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id') id: string) {
		await this.productService.delete(id)
	}
}
