import { UserRole } from '@/database/prisma/generated/client'

export interface AuthUserResponse {
	id: string
	email: string
	name: string | null
	phone: string | null
	avatar: string | null
	role: UserRole
	createdAt: Date
}
