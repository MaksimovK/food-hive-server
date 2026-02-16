import * as argon2 from 'argon2'

/**
 * Утилита для безопасного хеширования паролей и секретов
 * Использует Argon2id — гибридный алгоритм (защита от атак по времени + памяти)
 * Параметры подобраны по рекомендациям OWASP (2024):
 * - memoryCost: 64 МБ (защита от GPU-атак)
 * - timeCost: 3 итерации (баланс скорости/безопасности)
 * - параллелизм: 1 (оптимально для Node.js)
 */
export class HashUtil {
	private static readonly options = {
		type: argon2.argon2id,
		memoryCost: 65536,
		timeCost: 3,
		parallelism: 1,
		hashLength: 32,
		encoding: 'utf8' as const
	}

	/**
	 * Хеширует данные (пароль, refresh-токен)
	 * @param data Строка для хеширования
	 * @returns Хеш в формате PHC (с солью и параметрами)
	 */
	static async hash(data: string): Promise<string> {
		if (!data || typeof data !== 'string') {
			throw new Error('Invalid input for hashing')
		}
		return argon2.hash(data, this.options)
	}

	/**
	 * Верифицирует соответствие данных хешу
	 * Автоматически извлекает параметры и соль из PHC-формата
	 * @param hash Сохранённый хеш из БД
	 * @param data Проверяемая строка
	 * @returns true если совпадает
	 */
	static async verify(hash: string, data: string): Promise<boolean> {
		if (
			!hash ||
			!data ||
			typeof hash !== 'string' ||
			typeof data !== 'string'
		) {
			return false
		}
		return argon2.verify(hash, data)
	}
}
