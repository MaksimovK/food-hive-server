import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { IngredientModule } from './ingredient/ingredient.module'
import { ProductModule } from './product/product.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [AuthModule, UserModule, IngredientModule, CategoryModule, ProductModule]
})
export class ApiModule {}
