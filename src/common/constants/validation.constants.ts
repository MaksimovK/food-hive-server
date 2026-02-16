export const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const NAME_REGEX = /^[а-яА-ЯёЁa-zA-Z\s-]+$/

export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/

export const AVATAR_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i
