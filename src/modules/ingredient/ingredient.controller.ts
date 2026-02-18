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
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { IngredientService } from './ingredient.service'

@Controller('ingredients')
export class IngredientController {
	constructor(private ingredientService: IngredientService) {}

	@Get()
	async findAll() {
		return this.ingredientService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.ingredientService.findOne(id)
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateIngredientDto) {
		return this.ingredientService.create(dto)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	async update(@Param('id') id: string, @Body() dto: UpdateIngredientDto) {
		return this.ingredientService.update(id, dto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id') id: string) {
		await this.ingredientService.delete(id)
	}
}
