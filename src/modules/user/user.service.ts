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
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

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

		return await this.prisma.user.create({
			data: {
				...dto,
				password: hashedPassword,
				role: 'USER'
			},
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				avatar: true,
				role: true,
				createdAt: true
			}
		})
	}

	async getProfile(userId: string) {
		return this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				avatar: true,
				role: true,
				createdAt: true
			}
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
			if (phone !== null) {
				const existingPhone = await this.prisma.user.findUnique({
					where: { phone: phone }
				})

				if (existingPhone && existingPhone.id !== userId)
					throw new ConflictException(
						'Телефон уже используется другим пользователем'
					)

				updateData.phone = phone
			}
		}

		if (avatar !== undefined) updateData.avatar = avatar

		return this.prisma.user.update({
			where: { id: userId },
			data: updateData,
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				avatar: true,
				role: true
			}
		})
	}
}
