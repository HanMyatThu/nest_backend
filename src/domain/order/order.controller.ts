import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { IdDto } from 'common/dto/id.dto';
import { PaginationDto } from 'common/dto/pagination.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.orderService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() {id}: IdDto) {
    return this.orderService.findOne(id);
  }


  @Delete(':id')
  remove(@Param() {id}: IdDto) {
    return this.orderService.remove(id);
  }
}
