import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'common/dto/pagination.dto';
import { DEFAULT_PAGINATION_PAGE_SIZE } from 'common/utils/common.constants';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRespository: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.usersRespository.create(createUserDto);
    return this.usersRespository.save(user);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset} = paginationDto;
    const user = await this.usersRespository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGINATION_PAGE_SIZE.USER
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRespository.findOne({ 
      where: { id },
      relations: {
        orders: true,
      } 
    });
    if (!user) {
      throw new NotFoundException('User notfound')
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRespository.preload({
      id,
      ...updateUserDto
    })
    if (!user) {
      throw new NotFoundException('User notfound')
    }
    return this.usersRespository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.usersRespository.remove(user);
  }
}
