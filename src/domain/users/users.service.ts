import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    const user = await this.usersRespository.find();
    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRespository.findOneBy({ id });
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
    const user = await await this.findOne(id);
    return this.usersRespository.remove(user);
  }
}
