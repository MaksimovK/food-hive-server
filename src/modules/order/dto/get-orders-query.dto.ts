import { IsEnum, IsOptional } from 'class-validator'

export enum OrderSortBy {
	DATE = 'date',
	PRICE = 'price'
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc'
}

export class GetOrdersQueryDto {
	@IsOptional()
	@IsEnum(OrderSortBy)
	sortBy?: OrderSortBy = OrderSortBy.DATE

	@IsOptional()
	@IsEnum(SortOrder)
	sortOrder?: SortOrder = SortOrder.DESC
}
