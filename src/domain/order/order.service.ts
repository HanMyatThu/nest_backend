import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { DEFAULT_PAGINATION_PAGE_SIZE } from 'common/utils/common.constants';
import { OrderItemDto } from './dto/order-item.dto';
import { Product } from 'products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {

    const { items } = createOrderDto

    const itemsWithPrice = await Promise.all(
      items.map(item => this.createOrderItemWithPrice(item)),
    )

    const order = this.ordersRepository.create({
      ...createOrderDto,
      items: itemsWithPrice,
    });
    return this.ordersRepository.save(order);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset} = paginationDto;
    const orders = await this.ordersRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGINATION_PAGE_SIZE.ORDER
    })
    return orders;
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        items: {
          product: true,
        },
        customer: true,
        payment: true,
      }
    })
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    return order;
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this.ordersRepository.remove(order);
  }

  private async createOrderItemWithPrice(orderItemDto : OrderItemDto) {
    const { id } = orderItemDto.product;

    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const { price } = product;

    const orderItem = this.orderItemRepository.create({
      ...orderItemDto,
      price
    });

    return orderItem;
  }
}
