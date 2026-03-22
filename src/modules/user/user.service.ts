import { HashUtil } from '@/common/utils/hash.util'
import { Prisma } from '@/database/prisma/generated/client'
import { PrismaService } from '@/database/prisma/prisma.service'
import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { RegisterDto } from '../auth/dto/register.dto'
import { UploadService } from '../upload/upload.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { userSelect } from './types/user.types'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private uploadService: UploadService
	) {}

	async checkEmailExists(email: string): Promise<boolean> {
		const user = await this.prisma.user.findUnique({ where: { email } })
		return !!user
	}

	async create(dto: RegisterDto) {
		const hashedPassword = await HashUtil.hash(dto.password)

		if (dto.phone) {
			const phoneExists = await this.prisma.user.findUnique({
				where: { phone: dto.phone }
			})
			if (phoneExists)
				throw new ConflictException('Телефон уже зарегистрирован')
		}

		const [day, month, year] = dto.dateOfBirth.split('-').map(Number)
		const dateOfBirth = new Date(Date.UTC(year, month - 1, day))

		return await this.prisma.user.create({
			data: {
				...dto,
				password: hashedPassword,
				role: 'USER',
				dateOfBirth
			},
			select: userSelect
		})
	}

	async getProfile(userId: string) {
		return this.prisma.user.findUnique({
			where: { id: userId },
			select: userSelect
		})
	}

	async updateProfile(userId: string, dto: UpdateProfileDto) {
		const updateData: Prisma.UserUpdateInput = {}
		const { name, phone, avatar, newPassword, currentPassword } = dto

		if (newPassword) {
			if (!currentPassword)
				throw new BadRequestException(
					'Для смены пароля требуется текущий пароль'
				)

			const user = await this.prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, password: true }
			})

			if (!user) throw new NotFoundException('Пользователь не найден')

			const isPasswordValid = await HashUtil.verify(
				user.password,
				currentPassword
			)
			if (!isPasswordValid)
				throw new UnauthorizedException('Неверный текущий пароль')

			updateData.password = await HashUtil.hash(newPassword)

			await this.prisma.refreshToken.updateMany({
				where: { userId, revoked: false },
				data: { revoked: true }
			})
		}

		if (name !== undefined) updateData.name = name

		if (phone !== undefined) {
			const existingPhone = await this.prisma.user.findUnique({
				where: { phone: phone }
			})

			if (existingPhone && existingPhone.id !== userId)
				throw new ConflictException(
					'Телефон уже используется другим пользователем'
				)

			updateData.phone = phone
		}

		if (avatar !== undefined) {
			updateData.avatar = avatar ?? null
		}

		return this.prisma.user.update({
			where: { id: userId },
			data: updateData,
			select: userSelect
		})
	}

	async updateAvatar(userId: string, file: Express.Multer.File) {
		// Валидация файла
		this.uploadService.validateImageFile(file)

		// Получаем текущую аватарку для удаления
		const currentUser = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { avatar: true }
		})

		if (!currentUser) {
			throw new NotFoundException('Пользователь не найден')
		}

		// Удаляем старую аватарку
		if (currentUser.avatar) {
			this.uploadService.deleteAvatar(currentUser.avatar)
		}

		// Сохраняем новую аватарку
		const avatarPath = this.uploadService.saveAvatar(file, userId)

		// Обновляем запись в БД
		return this.prisma.user.update({
			where: { id: userId },
			data: { avatar: avatarPath },
			select: userSelect
		})
	}

	async removeAvatar(userId: string) {
		// Получаем текущую аватарку
		const currentUser = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { avatar: true }
		})

		if (!currentUser) {
			throw new NotFoundException('Пользователь не найден')
		}

		// Удаляем файл с диска
		if (currentUser.avatar) {
			this.uploadService.deleteAvatar(currentUser.avatar)
		}

		// Обновляем запись в БД
		return this.prisma.user.update({
			where: { id: userId },
			data: { avatar: null },
			select: userSelect
		})
	}
}
