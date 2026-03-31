import { Module } from '@nestjs/common'
import { AddressModule } from '../address/address.module'
import { CartModule } from '../cart/cart.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
	imports: [AddressModule, CartModule],
	controllers: [OrderController],
	providers: [OrderService],
	exports: [OrderService]
})
export class OrderModule {}
