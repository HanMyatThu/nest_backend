import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Order } from 'order/entities/order.entity';
import { OrderStatus } from 'order/enums/order-status.enum';

@Injectable()
export class PaymentsService {

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async payOrder(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        payment: true
      }
    })

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    if (order.payment) {
      throw new ConflictException('Order is already paid');
    }

    const payment = this.paymentRepository.create();
    order.payment = payment;
    order.status = OrderStatus.AWAITING_SHIPMENT;
    return this.orderRepository.save(order);
  }
}
