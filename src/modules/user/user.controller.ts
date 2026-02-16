import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	UseGuards
} from '@nestjs/common'
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
}
