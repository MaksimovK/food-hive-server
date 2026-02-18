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
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get()
	async findAll() {
		return this.categoryService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.categoryService.findOne(id)
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateCategoryDto) {
		return this.categoryService.create(dto)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
		return this.categoryService.update(id, dto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id') id: string) {
		await this.categoryService.delete(id)
	}
}
