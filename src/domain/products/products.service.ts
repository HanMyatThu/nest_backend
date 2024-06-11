import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { DEFAULT_PAGINATION_PAGE_SIZE } from 'common/utils/common.constants';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create({
      ...createProductDto,
      categories: createProductDto.categories
    });
    return this.productsRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset} = paginationDto;
    const products = await this.productsRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGINATION_PAGE_SIZE.PRODUCT
    })
    return products;
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: {
        categories: true,
      }
    })
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.preload({
      id,
      ...updateProductDto
    })
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productsRepository.remove(product);
  }
}
