import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import {
	BadRequestException,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
	constructor(private uploadService: UploadService) {}

	@Post('file')
	@UseInterceptors(
		FileInterceptor('file', {
			limits: {
				fileSize: 5 * 1024 * 1024
			}
		})
	)
	@HttpCode(HttpStatus.OK)
	async uploadFile(
		@CurrentUser('id') userId: string,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!file) {
			throw new BadRequestException('Файл обязателен')
		}

		return {
			message: 'Файл успешно загружен',
			filename: file.originalname,
			size: file.size,
			mimetype: file.mimetype
		}
	}
}
