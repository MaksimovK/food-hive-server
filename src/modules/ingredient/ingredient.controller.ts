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
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { IngredientService } from './ingredient.service'

@Controller('ingredients')
@ApiTags('ingredient')
export class IngredientController {
	constructor(private ingredientService: IngredientService) {}

	@Get()
	@ApiOperation({ summary: 'Получить все ингредиенты' })
	@ApiResponse({
		status: 200,
		description: 'Список ингредиентов',
		schema: {
			example: [
				{
					id: 'uuid',
					name: 'Сахар',
					containsGluten: false,
					containsDairy: false,
					containsNuts: false,
					containsSoy: false,
					containsEggs: false,
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			]
		}
	})
	async findAll() {
		return this.ingredientService.findAll()
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить ингредиент по ID' })
	@ApiParam({ name: 'id', description: 'ID ингредиента' })
	@ApiResponse({
		status: 200,
		description: 'Ингредиент найден',
		schema: {
			example: {
				id: 'uuid',
				name: 'Сахар',
				containsGluten: false,
				containsDairy: false,
				containsNuts: false,
				containsSoy: false,
				containsEggs: false,
				createdAt: '2024-01-01T00:00:00.000Z',
				updatedAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@ApiResponse({ status: 404, description: 'Ингредиент не найден' })
	async findOne(@Param('id') id: string) {
		return this.ingredientService.findOne(id)
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles('ADMIN')
	@ApiOperation({ summary: 'Создать ингредиент (только админ)' })
	@ApiBody({ type: CreateIngredientDto })
	@ApiResponse({
		status: 201,
		description: 'Ингредиент создан',
		schema: {
			example: {
				id: 'uuid',
				name: 'Сахар',
				containsGluten: false,
				containsDairy: false,
				containsNuts: false,
				containsSoy: false,
				containsEggs: false,
				createdAt: '2024-01-01T00:00:00.000Z',
				updatedAt: '2024-01-01T00:00:00.000Z'
			}
		}
	})
	@ApiResponse({ status: 409, description: 'Ингредиент уже существует' })
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateIngredientDto) {
		return this.ingredientService.create(dto)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles('ADMIN')
	@ApiOperation({ summary: 'Обновить ингредиент (только админ)' })
	@ApiParam({ name: 'id', description: 'ID ингредиента' })
	@ApiResponse({
		status: 200,
		description: 'Ингредиент обновлён'
	})
	@ApiResponse({ status: 404, description: 'Ингредиент не найден' })
	@ApiResponse({ status: 409, description: 'Ингредиент уже существует' })
	async update(@Param('id') id: string, @Body() dto: UpdateIngredientDto) {
		return this.ingredientService.update(id, dto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles('ADMIN')
	@ApiOperation({ summary: 'Удалить ингредиент (только админ)' })
	@ApiParam({ name: 'id', description: 'ID ингредиента' })
	@ApiResponse({ status: 204, description: 'Ингредиент удалён' })
	@ApiResponse({ status: 404, description: 'Ингредиент не найден' })
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id') id: string) {
		await this.ingredientService.delete(id)
	}
}
