import { Module } from '@nestjs/common'
import { AddressModule } from './address/address.module'
import { AuthModule } from './auth/auth.module'
import { BannerModule } from './banner/banner.module'
import { CartModule } from './cart/cart.module'
import { CategoryModule } from './category/category.module'
import { FavoriteModule } from './favorite/favorite.module'
import { HomeModule } from './home/home.module'
import { IngredientModule } from './ingredient/ingredient.module'
import { ProductModule } from './product/product.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		AuthModule,
		UserModule,
		IngredientModule,
		CategoryModule,
		ProductModule,
		BannerModule,
		FavoriteModule,
		CartModule,
		AddressModule,
		HomeModule
	]
})
export class ApiModule {}
