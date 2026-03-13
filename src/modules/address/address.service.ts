import { Prisma } from '@/database/prisma/generated/client'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'
import { addressSelect } from './types/address.types'

@Injectable()
export class AddressService {
	constructor(private prisma: PrismaService) {}

	async findAll(userId: string) {
		return this.prisma.address.findMany({
			where: { userId },
			select: addressSelect,
			orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
		})
	}

	async findOne(userId: string, id: string) {
		const address = await this.prisma.address.findUnique({
			where: { id, userId },
			select: addressSelect
		})

		if (!address) throw new NotFoundException('Адрес не найден')

		return address
	}

	async create(userId: string, dto: CreateAddressDto) {
		const { isDefault, ...rest } = dto

		if (isDefault) {
			await this.prisma.address.updateMany({
				where: { userId, isDefault: true },
				data: { isDefault: false }
			})
		}

		return this.prisma.address.create({
			data: {
				...rest,
				userId,
				isDefault: isDefault ?? false
			},
			select: addressSelect
		})
	}

	async update(userId: string, id: string, dto: UpdateAddressDto) {
		await this.findOne(userId, id)

		const { isDefault, ...rest } = dto

		const updateData: Prisma.AddressUpdateInput = { ...rest }

		if (isDefault === true) {
			await this.prisma.address.updateMany({
				where: { userId, isDefault: true, id: { not: id } },
				data: { isDefault: false }
			})
			updateData.isDefault = true
		} else if (isDefault === false) {
			updateData.isDefault = false
		}

		return this.prisma.address.update({
			where: { id },
			data: updateData,
			select: addressSelect
		})
	}

	async delete(userId: string, id: string) {
		await this.findOne(userId, id)

		const address = await this.prisma.address.delete({
			where: { id },
			select: addressSelect
		})

		const remainingAddresses = await this.prisma.address.findMany({
			where: { userId },
			select: { id: true }
		})

		if (
			remainingAddresses.length > 0 &&
			!remainingAddresses.some(a => a.id === id)
		) {
			const firstAddress = remainingAddresses[0]
			await this.prisma.address.update({
				where: { id: firstAddress.id },
				data: { isDefault: true }
			})
		}

		return address
	}

	async setDefault(userId: string, id: string) {
		await this.findOne(userId, id)

		await this.prisma.address.updateMany({
			where: { userId, isDefault: true },
			data: { isDefault: false }
		})

		return this.prisma.address.update({
			where: { id },
			data: { isDefault: true },
			select: addressSelect
		})
	}
}
