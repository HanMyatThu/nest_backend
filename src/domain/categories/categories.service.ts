import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { DEFAULT_PAGINATION_PAGE_SIZE } from 'common/utils/common.constants';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(paginationDto : PaginationDto) {
    const { limit, offset} = paginationDto;
    const categories = await this.categoriesRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGINATION_PAGE_SIZE.CATEGORY
    })
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: {
        products: true,
      }
    })
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.preload({
      id,
      ...updateCategoryDto
    })
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    return this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    // if category still has products
    if (category.products.length) {
      throw new ConflictException('Category has related products');
    }
    return this.categoriesRepository.remove(category);
  }
}
