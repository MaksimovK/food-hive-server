import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateBannerDto } from './dto/create-banner.dto'
import { UpdateBannerDto } from './dto/update-banner.dto'
import { bannerSelect } from './types/banner.types'

@Injectable()
export class BannerService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateBannerDto) {
		const { image, title, description, link, order, isActive } = dto

		return this.prisma.banner.create({
			data: {
				image,
				title,
				description,
				link,
				order: order ?? 0,
				isActive: isActive ?? true
			},
			select: bannerSelect
		})
	}

	async findAll() {
		return this.prisma.banner.findMany({
			where: { isActive: true },
			orderBy: { order: 'asc' },
			select: bannerSelect
		})
	}

	async findOne(id: string) {
		const banner = await this.prisma.banner.findUnique({
			where: { id, isActive: true },
			select: bannerSelect
		})

		if (!banner) throw new NotFoundException('Баннер не найден')

		return banner
	}

	async update(id: string, dto: UpdateBannerDto) {
		await this.findOne(id)

		return this.prisma.banner.update({
			where: { id },
			data: dto,
			select: bannerSelect
		})
	}

	async delete(id: string) {
		await this.findOne(id)

		await this.prisma.banner.delete({
			where: { id },
			select: bannerSelect
		})
	}
}
