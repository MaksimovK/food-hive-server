import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UserService } from './user.service'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
	constructor(private usersService: UserService) {}

	@Get('profile')
	@HttpCode(HttpStatus.OK)
	getProfile(@CurrentUser('id') userId: string) {
		return this.usersService.getProfile(userId)
	}

	@Patch('profile')
	@HttpCode(HttpStatus.OK)
	updateProfile(
		@CurrentUser('id') userId: string,
		@Body() dto: UpdateProfileDto
	) {
		return this.usersService.updateProfile(userId, dto)
	}

	@Patch('profile/avatar')
	@UseInterceptors(
		FileInterceptor('avatar', {
			limits: {
				fileSize: 5 * 1024 * 1024
			}
		})
	)
	@HttpCode(HttpStatus.OK)
	async uploadAvatar(
		@CurrentUser('id') userId: string,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!file) {
			return this.usersService.removeAvatar(userId)
		}

		return this.usersService.updateAvatar(userId, file)
	}

	@Delete('profile/avatar')
	@HttpCode(HttpStatus.OK)
	async removeAvatar(@CurrentUser('id') userId: string) {
		return this.usersService.removeAvatar(userId)
	}
}
