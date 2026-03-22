import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { existsSync, mkdirSync, unlinkSync } from 'fs'
import { join } from 'path'

@Injectable()
export class UploadService {
	constructor(private configService: ConfigService) {}

	/**
	 * Сохраняет файл аватарки на диске
	 * @param file Файл из multer
	 * @param userId ID пользователя для именования файла
	 * @returns Путь к файлу относительно public
	 */
	saveAvatar(file: Express.Multer.File, userId: string): string {
		const uploadPath =
			this.configService.get<string>('AVATAR_UPLOAD_PATH') || './public/avatars'
		const absolutePath = join(process.cwd(), uploadPath)

		// Создаём директорию, если не существует
		if (!existsSync(absolutePath)) {
			mkdirSync(absolutePath, { recursive: true })
		}

		// Генерируем уникальное имя файла
		const timestamp = Date.now()
		const extension = this.getFileExtension(file.originalname)
		const fileName = `avatar_${userId}_${timestamp}.${extension}`
		const filePath = join(absolutePath, fileName)

		// Сохраняем файл
		const fs = require('fs')
		fs.writeFileSync(filePath, file.buffer)

		// Возвращаем относительный путь для БД
		return `/avatars/${fileName}`
	}

	/**
	 * Удаляет старую аватарку пользователя
	 * @param avatarPath Путь к файлу (из БД)
	 */
	deleteAvatar(avatarPath: string): void {
		if (!avatarPath) return

		try {
			const uploadPath =
				this.configService.get<string>('AVATAR_UPLOAD_PATH') ||
				'./public/avatars'
			const fileName = avatarPath.split('/').pop()

			if (!fileName) return

			const absolutePath = join(process.cwd(), uploadPath, fileName)

			if (existsSync(absolutePath)) {
				unlinkSync(absolutePath)
			}
		} catch (error) {
			console.error('Ошибка при удалении аватарки:', error)
		}
	}

	/**
	 * Получает расширение файла из имени
	 */
	private getFileExtension(filename: string): string {
		return filename.split('.').pop()?.toLowerCase() || 'jpg'
	}

	/**
	 * Проверяет, является ли файл изображением
	 */
	validateImageFile(file: Express.Multer.File): void {
		const allowedMimeTypes = this.configService
			.get<string>('ALLOWED_AVATAR_TYPES')
			?.split(',') || ['image/jpeg', 'image/png', 'image/webp']

		if (!allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException(
				`Неверный формат файла. Разрешены: ${allowedMimeTypes.join(', ')}`
			)
		}

		const maxSize = parseInt(
			this.configService.get<string>('MAX_AVATAR_SIZE') || '5242880',
			10
		)

		if (file.size > maxSize) {
			throw new BadRequestException(
				`Размер файла не должен превышать ${this.formatBytes(maxSize)}`
			)
		}
	}

	/**
	 * Форматирует размер файла в человекочитаемый вид
	 */
	private formatBytes(bytes: number): string {
		const mb = bytes / (1024 * 1024)
		return `${mb.toFixed(1)} MB`
	}
}
